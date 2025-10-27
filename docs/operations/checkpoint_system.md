# Checkpoint System Guide

## Overview

The checkpoint system automatically prompts you every 20 minutes to commit your changes with smart, context-aware commit message suggestions.

## How It Works

### Automatic Reminders
- **Frequency**: Every 20 minutes (1200 seconds)
- **Detection**: Automatically detects uncommitted changes
- **Smart Messages**: Analyzes your changes and suggests relevant commit messages

### What You'll See

Every 20 minutes, if you have uncommitted changes, you'll see:

```
⏰ It's been 1200 seconds since your last checkpoint.
📝 Detected uncommitted changes.

📋 Changed files:
  - docs/schema.sql
  - config/env.ts
  - lib/supabase/client.ts

Create a checkpoint now? (yes/no)
```

If you answer **yes**:
```
Commit message (default: implement Supabase client setup):
```

Press Enter to accept the suggestion, or type your own message.

## Smart Message Suggestions

The system analyzes your changes and suggests messages like:

| Changed Files | Suggested Message |
|---------------|-------------------|
| `.env`, `.env.local` | "configure environment variables" |
| `schema.sql` | "update database schema" |
| `supabase/` files | "implement Supabase client setup" |
| `config/env.ts` | "add environment validation" |
| `auth/` files | "implement authentication" |
| `components/XYZ` | "add XYZ component" |
| `lib/hooks/useXYZ` | "implement useXYZ hook" |
| Test files | "add tests" |
| `README`, `docs/` | "update documentation" |
| `package.json` | "update dependencies" |
| Single file | "update [filename]" |
| Multiple files | "update N files" |

## Commands

### Start the checkpoint reminder
```bash
./scripts/checkpoint-start.sh
```

This runs in the **foreground** of your current terminal. Keep this terminal open while you work.

### Stop the checkpoint reminder
Press `Ctrl+C` in the terminal running the checkpoint script

Or in another terminal:
```bash
./scripts/checkpoint-stop.sh
```

### Manual checkpoint (anytime)
```bash
pnpm checkpoint
# or
bash scripts/checkpoint.sh create "your message here"
```

### List all checkpoints
```bash
bash scripts/checkpoint.sh list
```

### Revert to a checkpoint
```bash
bash scripts/checkpoint.sh revert <checkpoint-name>
```

## Configuration

### Change reminder interval
Create a `.checkpointrc` file in the project root:

```bash
# .checkpointrc
REMINDER_INTERVAL=900    # 15 minutes
BRANCH_TAG="save"        # Change default tag prefix
```

## Workflow

### Typical Development Session

1. **Start your session**:
   ```bash
   cd /path/to/slack-ai-dryrun
   ./scripts/checkpoint-start.sh
   ```

2. **Work on your code** - Edit files, implement features

3. **Every 20 minutes** - Script prompts you:
   - See suggested commit message based on your changes
   - Press Enter to accept or type your own
   - Changes are committed and tagged

4. **End your session** - Press `Ctrl+C` to stop the reminder

### Benefits

✅ **Regular commits**: Never lose more than 20 minutes of work  
✅ **Smart suggestions**: Context-aware commit messages  
✅ **Easy rollback**: Tagged checkpoints for easy recovery  
✅ **Automatic**: Works in background while you code  
✅ **Flexible**: Accept suggestions or write your own messages  

## Recovery

If you need to revert to an earlier checkpoint:

1. **List checkpoints**:
   ```bash
   bash scripts/checkpoint.sh list
   ```

2. **Revert to checkpoint**:
   ```bash
   bash scripts/checkpoint.sh revert checkpoint-<name>-<timestamp>
   ```

This creates a new branch with the checkpoint state.

## Current Configuration

- **Interval**: 20 minutes (1200 seconds)
- **Auto-start**: Run `./scripts/checkpoint-start.sh`
- **Smart messages**: ✅ Enabled
- **File preview**: Shows up to 5 changed files
- **Tagging**: ✅ Creates git tags for easy reference

## Example Session

```bash
$ ./scripts/checkpoint-start.sh
🔁 Starting checkpoint reminder (running in foreground)...
   Press Ctrl+C to stop.
⏳ Checkpoint reminder active — ping every 1200s.

# ... 20 minutes later ...

⏰ It's been 1200 seconds since your last checkpoint.
📝 Detected uncommitted changes.

📋 Changed files:
  - config/env.ts
  - lib/supabase/client.ts
  - .env.local

Create a checkpoint now? (yes/no) yes

Commit message (default: add environment validation): 
✅ Checkpoint recorded: add environment validation
🏷️  Tagged as: ckpt-2025-10-10_0945
```

## Tips

1. **Keep terminal visible**: Run checkpoint-start.sh in a dedicated terminal tab
2. **Accept suggestions**: The auto-generated messages are usually accurate
3. **Customize when needed**: Override the suggestion if it doesn't fit
4. **Don't skip**: Even small changes are worth committing for safety
5. **Review commits**: Check your commit history occasionally with `git log --oneline`

## Troubleshooting

### Reminder not showing
- Check if the script is running: `ps aux | grep commit-reminder`
- Restart: `./scripts/checkpoint-stop.sh && ./scripts/checkpoint-start.sh`

### Can't commit
- Ensure you're in the git repository root
- Check git status: `git status`

### Wrong suggestions
- Just type your own message when prompted
- The script learns from file patterns, so suggestions improve over time

---

**The checkpoint system is your safety net!** Use it to keep your work safe and make iterative development stress-free. 🚀
