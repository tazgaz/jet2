---
description: How to fix the "Stuck Terminal" or "Busy Pipe" issue when commands fail to return output.
---

# Fix Stuck Terminal Workflow

If you notice that terminal commands (like `run_command`) remain in a "RUNNING" state for simple tasks (like `echo` or `dir`) or return no output indefinitely, the terminal instance is likely stuck due to a previous unreleased process or a blocked pipe.

## Identification
- Simple commands take more than 5-10 seconds to respond.
- `command_status` shows "RUNNING" but no output is ever received.
- `terminate: true` in `send_command_input` fails to kill the process.

## Steps to Fix

### 1. Kill the blocking processes (Manual or via Shell)
Ask the user to run the following in their own terminal to force-close the backend processes:

```powershell
# Kill stray Node processes
taskkill /F /IM node.exe

# Kill the stuck PowerShell instances (this is the most effective)
taskkill /F /IM powershell.exe
```

### 2. Use "Clean" Shell Commands
When restarting work, prefer running commands without loading user profiles to avoid hanging on scripts:

```powershell
powershell -NoProfile -Command "your-command-here"
```

### 3. Use Background Tasks correctly
Avoid running long-running processes (like `npm run dev`) in the primary terminal. Always use the `Background command ID` flow and never block the main communication channel.

### 4. Reset the Agent's Terminal Perception
If the terminal is still behaving oddly after a `taskkill`, tell the user you are starting a fresh session and use `echo "System Check"` as a first command to verify connectivity.
