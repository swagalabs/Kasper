import * as vscode from 'vscode';
import { AliasEntry, KasperModule } from '../types';

/**
 * AliasManager — central registry that maps human-readable aliases to real
 * resource identifiers across all Kasper modules.
 *
 * Aliases use prefixes to distinguish types:
 *   @user      — people  (Google / GitHub)
 *   #channel   — chat spaces, teams
 *   $repo      — repositories
 *   !project   — GitHub projects
 *   ~event     — calendar events / meetings
 *
 * Any module can register aliases; any module can resolve them.
 */
export class AliasManager {
  private aliases = new Map<string, AliasEntry>();
  private _onAliasChanged = new vscode.EventEmitter<void>();
  readonly onAliasChanged = this._onAliasChanged.event;

  register(entry: AliasEntry): void {
    this.aliases.set(entry.alias.toLowerCase(), entry);
    this._onAliasChanged.fire();
  }

  registerBatch(entries: AliasEntry[]): void {
    for (const entry of entries) {
      this.aliases.set(entry.alias.toLowerCase(), entry);
    }
    this._onAliasChanged.fire();
  }

  resolve(alias: string): AliasEntry | undefined {
    return this.aliases.get(alias.toLowerCase());
  }

  /** Resolve all aliases found inside a text string, returning enriched text */
  resolveInText(text: string): { resolved: string; found: AliasEntry[] } {
    const found: AliasEntry[] = [];
    const resolved = text.replace(/[@#$!~][\w-]+/g, (match) => {
      const entry = this.resolve(match);
      if (entry) {
        found.push(entry);
        return entry.displayName;
      }
      return match;
    });
    return { resolved, found };
  }

  /** Get all aliases for a given module */
  getByModule(module: KasperModule): AliasEntry[] {
    return Array.from(this.aliases.values()).filter(a => a.module === module);
  }

  /** Get all aliases of a specific resource type */
  getByType(resourceType: string): AliasEntry[] {
    return Array.from(this.aliases.values()).filter(a => a.resourceType === resourceType);
  }

  /** Search aliases by partial match */
  search(query: string): AliasEntry[] {
    const q = query.toLowerCase();
    return Array.from(this.aliases.values()).filter(
      a => a.alias.toLowerCase().includes(q) ||
           a.displayName.toLowerCase().includes(q)
    );
  }

  /** Build a reverse lookup: resourceId → alias */
  reverseResolve(resourceId: string): AliasEntry | undefined {
    return Array.from(this.aliases.values()).find(a => a.resourceId === resourceId);
  }

  getAll(): AliasEntry[] {
    return Array.from(this.aliases.values());
  }

  remove(alias: string): boolean {
    const deleted = this.aliases.delete(alias.toLowerCase());
    if (deleted) { this._onAliasChanged.fire(); }
    return deleted;
  }

  clear(): void {
    this.aliases.clear();
    this._onAliasChanged.fire();
  }

  dispose(): void {
    this._onAliasChanged.dispose();
  }
}
