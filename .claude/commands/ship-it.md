# Ship It — Build, Commit, Push

Full shipping flow: compile, verify, commit, create remote if needed, push.

## Steps:

### 1. Compile & verify
```bash
npm run compile  # or appropriate build command
```
If errors — fix them before proceeding.

### 2. Stage changes
- Run `git status`
- Stage relevant files (NOT node_modules, NOT .env, NOT secrets)
- Use specific file paths, avoid `git add -A` unless user confirms

### 3. Commit
- Analyze staged diff
- Write concise commit message: type(scope): description
- Types: feat, fix, docs, refactor, chore, test
- Include Co-Authored-By

### 4. Ensure remote exists
```bash
gh auth status  # check auth
gh repo view {org}/{name}  # check if repo exists
# If not:
gh repo create {org}/{name} --public --source=. --push
# If yes:
git remote add origin ... (if no remote set)
git push -u origin main
```

### 5. Push
```bash
git push
```

### 6. Verify
```bash
gh repo view {org}/{name} --web  # or just confirm push succeeded
```

## Rules:
- NEVER push secrets, .env files, credentials
- ALWAYS compile/build before committing
- If `gh` not installed: `brew install gh`
- If not authenticated: tell user to run `gh auth login`
- Prefer HTTPS over SSH unless SSH is already configured
- Create repo as public by default unless told otherwise
