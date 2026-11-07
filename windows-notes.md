# Windows setup notes

Problems I hit setting up Switch Console + OpenCode on Windows, and how I fixed them.

## 1. Switch Console can't find OpenCode

`opencode --version` says *"not recognized"*.

- Make sure the command-line version is installed: `npm install -g opencode-ai`. The OpenCode desktop app does **not** add the `opencode` command.
- Add npm's global folder to your user PATH: search Windows for **"Edit environment variables for your account"** → **Path** → **Edit** → **New** → `C:\Users\<you>\AppData\Roaming\npm`.
- Open a new terminal, and fully quit and reopen Switch Console (including from the system tray). Apps only read PATH when they start.
- If Console still can't see it, it may need the real `.exe` rather than npm's `opencode.cmd` launcher. Add this folder to PATH too:
  `%APPDATA%\npm\node_modules\opencode-ai\node_modules\opencode-windows-x64\bin`

Tip: `%APPDATA%` works in Command Prompt; `$env:APPDATA` works in PowerShell. Mixing them up gives *"The filename, directory name, or volume label syntax is incorrect."*

## 2. "Database is not empty and has no session table"

`opencode auth login` fails with this error. In my case the OpenCode desktop app and the CLI had both been installed and clashed.

1. Uninstall the desktop app (Switch only needs the CLI).
2. Quit Switch Console and end any `opencode` processes (`taskkill /f /im opencode.exe`).
3. Rename the data folder so OpenCode creates a fresh database:
   `ren "%USERPROFILE%\.local\share\opencode" opencode-old`
4. Update and log in again: `npm install -g opencode-ai@latest`, then `opencode auth login`.

## 3. "Access denied" when renaming the folder

Something is still using it, usually OpenCode running in the background under Switch Console. Restart the PC, close Switch Console if it starts automatically, and rename the folder before opening anything else.

## 4. Agent session seems stuck

Open the agent's session in Switch Console and check for a pending permission prompt or an error (quota, provider outage). Also check replies in the **thread** under your message, not just the main channel.
