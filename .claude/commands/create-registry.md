# Create Registry/Alias System

Generate a generic registry pattern — a central store that maps identifiers to typed entries with events, search, and batch operations.

## Pattern:

```typescript
import * as vscode from 'vscode';

interface RegistryEntry<T> {
  key: string;
  value: T;
  metadata?: Record<string, string>;
}

class Registry<T> {
  private entries = new Map<string, RegistryEntry<T>>();
  private _onChanged = new vscode.EventEmitter<void>();
  readonly onChanged = this._onChanged.event;

  register(key: string, value: T, metadata?: Record<string, string>): void;
  registerBatch(entries: Array<{ key: string; value: T }>): void;
  resolve(key: string): T | undefined;
  search(query: string, matcher: (entry: RegistryEntry<T>, q: string) => boolean): RegistryEntry<T>[];
  getAll(): RegistryEntry<T>[];
  remove(key: string): boolean;
  clear(): void;
  dispose(): void;
}
```

## Key features:
- **EventEmitter** — fires on any change so consumers can re-render
- **Batch registration** — fires event once after adding many entries
- **Case-insensitive keys** — `.toLowerCase()` on set/get
- **Search** — accepts custom matcher function
- **Reverse lookup** — find key by value property
- **Type-safe** — generic `<T>` for the value type
- **resolveInText()** — regex replace all matching patterns in a string

## Use cases:
- Alias system (maps `@anna` → user object)
- Route registry (maps paths → handlers)
- Feature flags (maps names → boolean + config)
- Theme tokens (maps names → colors)
- Shortcut registry (maps key combos → actions)

## Input needed:
- Entry type (what the registry stores)
- Key format (prefix patterns, naming convention)
- Whether to persist (localStorage, file, API)
