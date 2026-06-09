# Scaffold VS Code Extension

Create a complete VS Code extension project from scratch with the following structure:

## What to generate:

1. **package.json** — extension manifest with:
   - `contributes.viewsContainers.activitybar` — custom icon in Activity Bar
   - `contributes.views` — webview panels for each module
   - `contributes.commands` — commands for each module + navigation
   - `contributes.configuration` — settings schema
   - Scripts: compile, watch, lint

2. **tsconfig.json** — target ES2022, commonjs, strict, sourceMap, outDir "out"

3. **src/extension.ts** — entry point that:
   - Instantiates core services
   - Registers all webview providers
   - Registers commands
   - Creates status bar item
   - Wires navigation between providers

4. **src/types.ts** — all TypeScript interfaces

5. **src/webview/theme.ts** — shared CSS using VS Code CSS variables:
   - `--vscode-foreground`, `--vscode-editor-background`, etc.
   - `.card`, `.badge`, `.avatar`, `.btn`, `.search-box`, `.alias` classes
   - `wrapHtml()` helper that wraps body + script with full HTML document

6. **media/icons/{name}.svg** — Activity Bar icon

7. **.gitignore**, **.vscodeignore**

## Rules:
- Use VS Code Webview API (registerWebviewViewProvider)
- All webviews must support theme switching via CSS variables
- Every provider must implement: resolveWebviewView, refresh(), navigateTo()
- Enable scripts in webview options
- Handle postMessage from webview for navigation and actions
- TypeScript strict mode, no `any` types

## Input needed from user:
- Extension name
- List of modules/panels
- What data each module displays
