@echo off
setlocal
rem Resets the demo repo to its starting state so you can run the demo again.
rem WARNING: deletes all merges, fixes and agent-created branches in the demo folder.
rem Usage: reset-demo.cmd [demo-folder]   (default: %USERPROFILE%\switch-demo)

set "TARGET=%~1"
if "%TARGET%"=="" set "TARGET=%USERPROFILE%\switch-demo"
cd /d "%TARGET%" || (echo Folder "%TARGET%" not found. & exit /b 1)

git rev-parse -q --verify demo-start >nul || (echo Tag demo-start is missing. Run setup-demo.cmd first. & exit /b 1)

echo This will reset "%TARGET%" and delete agent-created branches.
set /p OK=Type yes to continue: 
if /i not "%OK%"=="yes" (echo Cancelled. & exit /b 0)

git checkout -q -f main || exit /b 1
git reset -q --hard demo-start
git clean -q -fd

rem Delete every feature/* branch, then recreate the two demo branches
for /f "delims=" %%b in ('git for-each-ref --format^="%%(refname:short)" refs/heads/feature/') do git branch -q -D %%b
git branch -q feature/discount-codes demo-buggy
git rev-parse -q --verify demo-payment >nul && git branch -q feature/payment-config demo-payment

echo.
echo Reset complete:
git log --oneline --all --decorate
endlocal
