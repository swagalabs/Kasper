# Create Webview Provider

Generate a new VS Code Webview Provider following the established pattern.

## Template structure:

```typescript
import * as vscode from 'vscode';
import { KasperModule, KasperWebviewProvider } from '../types';
import { AliasManager } from '../alias/aliasManager';
import { wrapHtml } from '../webview/theme';

export class {Name}Provider implements KasperWebviewProvider {
  readonly moduleId: KasperModule = '{module-id}';
  private _view?: vscode.WebviewView;

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly aliasManager: AliasManager,
    private readonly onNavigate: (alias: string) => void,
  ) {}

  resolveWebviewView(view: vscode.WebviewView): void {
    this._view = view;
    view.webview.options = { enableScripts: true };
    view.webview.onDidReceiveMessage(msg => {
      if (msg.type === 'navigate') { this.onNavigate(msg.alias); }
      // Handle module-specific actions
    });
    this.render();
  }

  refresh(): void { this.render(); }
  navigateTo(resourceType?: string, resourceId?: string): void { this.render(); }

  private render(): void {
    if (!this._view) { return; }
    const body = `...`;
    this._view.webview.html = wrapHtml('{Title}', body);
  }

  private renderAliases(text: string): string {
    return text.replace(/[@#$!~][\w-]+/g, (match) => {
      const entry = this.aliasManager.resolve(match);
      if (entry) {
        return `<span class="alias" onclick="navigate('${match}')">${match}</span>`;
      }
      return match;
    });
  }
}
```

## Checklist:
- [ ] Implements KasperWebviewProvider interface
- [ ] Has moduleId matching the KasperModule type
- [ ] Constructor takes: extensionUri, aliasManager, onNavigate callback
- [ ] resolveWebviewView enables scripts and sets up message handler
- [ ] render() generates full HTML via wrapHtml()
- [ ] renderAliases() makes all aliases clickable
- [ ] navigateTo() accepts optional resourceType + resourceId for deep linking
- [ ] All inline data uses aliases instead of raw URLs

## After creating:
1. Register in extension.ts with `vscode.window.registerWebviewViewProvider`
2. Add view entry in package.json `contributes.views`
3. Register with Navigator via `navigator.registerProvider()`
4. Add aliases to mockData.ts or real data source

## Input needed:
- Module name and ID
- What data it displays
- What actions it supports (buttons, inputs)
