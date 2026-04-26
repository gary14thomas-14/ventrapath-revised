# VentraPath Recovery + Checkpointing

## Golden rule

If it matters, write it to a file and commit it.

## Before risky work

1. Update the relevant files.
2. Run `git status`.
3. Commit a checkpoint.

Example:

```powershell
git add .
git commit -m "checkpoint: before <change>"
```

## After a meaningful milestone

```powershell
git add .
git commit -m "VentraPath: <milestone>"
```

## Minimum files to keep current

- `agents.md`
- `decisions.md`
- `todo.md`

## If chat context gets wiped again

1. Open this folder first.
2. Read `README.md`, `agents.md`, `decisions.md`, and `todo.md`.
3. Resume from the latest commit instead of trying to reconstruct from memory.
