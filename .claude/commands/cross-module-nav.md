# Cross-Module Navigation Pattern

Generate a navigation system that routes between multiple views/modules with history tracking.

## Pattern:

```typescript
class Navigator {
  private providers = new Map<string, Provider>();
  private history: NavEvent[] = [];
  private historyIndex = -1;
  private _onNavigate = new EventEmitter<NavEvent>();

  registerProvider(provider: Provider): void;
  async navigate(target: NavTarget): Promise<void>;
  async goBack(): Promise<void>;
  async goForward(): Promise<void>;
}
```

## Key concepts:

### 1. Navigation Target
```typescript
interface NavTarget {
  module: string;        // which view to focus
  resourceType?: string; // what kind of thing to show
  resourceId?: string;   // specific item to highlight
  alias?: string;        // resolve via registry first
}
```

### 2. Navigation Flow
1. Resolve alias → get target module + resource
2. Focus target view (framework-specific: VS Code command, React router, etc.)
3. Tell target provider to scroll/highlight the resource
4. Record in history (truncate forward history on new navigation)
5. Fire event for listeners

### 3. History Management
- Array of NavEvents with index pointer
- Navigate → push to array, set index to end
- Back → decrement index, navigate to history[index]
- Forward → increment index, navigate to history[index]
- New navigation from middle → truncate array at index

## Adaptable to:
- VS Code Extension (webview focus commands)
- React SPA (react-router + scroll-to)
- Electron app (BrowserWindow focus + IPC)
- Web app with iframes/tabs

## Input needed:
- List of modules/views
- How to "focus" a view in the target framework
- What "navigate to resource" means for each module
