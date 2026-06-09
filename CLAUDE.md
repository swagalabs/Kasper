# Kasper — Project Instructions

## What this is
VS Code extension integrating Google Chat, Meet, Calendar and GitHub Org/Repos/Projects into a unified sidebar with alias-based cross-module navigation.

## Build
```bash
npm install
npm run compile    # one-time
npm run watch      # dev mode
```

## Test
Press F5 in VS Code → Extension Development Host opens → click Kasper icon in Activity Bar.

## Architecture
- **Providers** (`src/providers/`) — each is a webview panel implementing `KasperWebviewProvider`
- **AliasManager** (`src/alias/`) — central registry mapping `@user`, `#channel`, `$repo`, `!project`, `~event` to real resources
- **Navigator** (`src/navigation/`) — routes between modules with history
- **Theme** (`src/webview/theme.ts`) — shared CSS via VS Code CSS variables, `wrapHtml()` helper

## Adding a new module
1. Create provider in `src/providers/` (use `/create-webview-provider` command)
2. Add view in `package.json` → `contributes.views.kasper`
3. Register in `extension.ts`
4. Add aliases in `mockData.ts`

## Conventions
- Aliases use prefixes: `@` people, `#` channels/teams, `$` repos, `!` projects, `~` events
- All webviews must use `wrapHtml()` from theme.ts
- All provider constructors take: `extensionUri`, `aliasManager`, `onNavigate`
- TypeScript strict mode, no `any`
- Mock data in `src/services/mockData.ts`, real API calls will go in `src/services/`
