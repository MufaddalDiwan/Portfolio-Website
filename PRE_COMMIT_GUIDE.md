# Pre-commit Hooks Guide

This project uses Husky to run pre-commit hooks that help maintain code quality by checking formatting and linting before commits.

## What happens on commit

When you run `git commit`, the pre-commit hook will automatically:

1. **Check frontend formatting** with Prettier
2. **Check backend formatting** with Black
3. **Run frontend linting** with ESLint
4. **Run backend linting** with Ruff

## Auto-fixing issues

The pre-commit hook will automatically fix formatting issues when possible:
- Frontend formatting issues are auto-fixed with Prettier
- Backend formatting issues are auto-fixed with Black

## Manual fixes required

Some linting issues require manual intervention:
- Unused variables
- Missing type annotations
- Constructor injection vs inject() function usage
- Complex code style issues

## Available commands

### Fix all auto-fixable issues
```bash
npm run precommit
```

### Fix formatting only
```bash
npm run format
```

### Fix linting only (auto-fixable issues)
```bash
npm run lint:fix
```

### Check status without fixing
```bash
npm run format:check
npm run lint
```

### Individual commands
```bash
# Frontend only
npm run format:frontend
npm run lint:frontend
npm run lint:fix:frontend

# Backend only
npm run format:backend
npm run lint:backend
npm run lint:fix:backend
```

## Bypassing pre-commit hooks

If you need to commit without running the hooks (not recommended):
```bash
git commit --no-verify -m "Your commit message"
```

## Setup for new developers

The pre-commit hooks are automatically installed when you run:
```bash
npm install
```

This is handled by the `prepare` script in package.json that runs `husky` to set up the Git hooks.

## Troubleshooting

### Hook not running
- Make sure you're in the project root directory
- Ensure Husky is installed: `npm install husky`
- Check that `.husky/pre-commit` file exists and is executable

### Permission issues
```bash
chmod +x .husky/pre-commit
```

### Linting errors preventing commit
1. Review the error messages in the terminal
2. Run `npm run lint:fix` to auto-fix what's possible
3. Manually fix remaining issues
4. Commit again

## Benefits

- **Consistent code style** across the entire codebase
- **Catch errors early** before they reach the repository
- **Automated formatting** reduces manual work
- **Team collaboration** with shared code standards