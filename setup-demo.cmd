@echo off
setlocal
rem Builds the demo cart repo that the agents work in.
rem Usage: setup-demo.cmd [target-folder]   (default: %USERPROFILE%\switch-demo)

set "SRC=%~dp0demo-template"
set "TARGET=%~1"
if "%TARGET%"=="" set "TARGET=%USERPROFILE%\switch-demo"

where git >nul 2>&1 || (echo Git is not installed or not on PATH. Install it from git-scm.com. & exit /b 1)
where npm >nul 2>&1 || (echo Node.js/npm is not installed or not on PATH. Install the LTS version from nodejs.org. & exit /b 1)

if exist "%TARGET%" (
  echo "%TARGET%" already exists. Delete it or pass a different folder, e.g. setup-demo.cmd C:\temp\switch-demo
  exit /b 1
)

echo Creating demo repo in "%TARGET%" ...
xcopy "%SRC%\main" "%TARGET%\" /E /I /Q >nul || exit /b 1
move /Y "%TARGET%\gitignore.txt" "%TARGET%\.gitignore" >nul
cd /d "%TARGET%" || exit /b 1

git init -q || exit /b 1
git checkout -q -b main
git config user.name >nul 2>&1 || git config user.name "Demo Dev"
git config user.email >nul 2>&1 || git config user.email "demo@example.com"

git add . && git commit -q -m "Initial cart library with GST and tests" || exit /b 1
git tag demo-start

rem Branch 1: discount codes with a deliberate bug (discount applied twice)
git checkout -q -b feature/discount-codes
copy /Y "%SRC%\discount\cart.js" src\cart.js >nul
copy /Y "%SRC%\discount\cart.test.js" test\cart.test.js >nul
git add . && git commit -q -m "Add discount codes (SAVE10, FESTIVE20)" || exit /b 1
git tag demo-buggy

rem Branch 2: payment config with a planted FAKE key for the security agent
git checkout -q main
git checkout -q -b feature/payment-config
copy /Y "%SRC%\payment\config.js" src\config.js >nul
git add . && git commit -q -m "Add payment config" || exit /b 1
git tag demo-payment

git checkout -q main
echo.
echo Done. Branches:
git branch
echo.
echo Running tests on main:
call npm test --silent
echo.
echo Set every agent's working directory in Switch Console to: %TARGET%
endlocal
