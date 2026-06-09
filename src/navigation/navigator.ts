import * as vscode from 'vscode';
import { KasperModule, NavigationTarget, NavigationEvent, KasperWebviewProvider } from '../types';
import { AliasManager } from '../alias/aliasManager';

/**
 * Navigator — handles cross-module navigation inside Kasper.
 *
 * When a user clicks an alias like @anna in Google Chat, the navigator:
 *   1. Resolves the alias via AliasManager
 *   2. Determines the target module
 *   3. Focuses that module's webview
 *   4. Tells the target provider to scroll/highlight the resource
 *
 * History is kept so the user can go back/forward between views.
 */
export class Navigator {
  private providers = new Map<KasperModule, KasperWebviewProvider>();
  private history: NavigationEvent[] = [];
  private historyIndex = -1;

  private _onNavigate = new vscode.EventEmitter<NavigationEvent>();
  readonly onNavigate = this._onNavigate.event;

  constructor(private aliasManager: AliasManager) {}

  registerProvider(provider: KasperWebviewProvider): void {
    this.providers.set(provider.moduleId, provider);
  }

  async navigate(target: NavigationTarget, fromModule?: KasperModule): Promise<void> {
    // If navigation is by alias, resolve it first
    if (target.alias) {
      const entry = this.aliasManager.resolve(target.alias);
      if (entry) {
        target.module = entry.module;
        target.resourceType = entry.resourceType;
        target.resourceId = entry.resourceId;
      }
    }

    const provider = this.providers.get(target.module);
    if (!provider) {
      vscode.window.showWarningMessage(`Module "${target.module}" is not available`);
      return;
    }

    // Focus the target view in the sidebar
    const viewId = this.moduleToViewId(target.module);
    await vscode.commands.executeCommand(`${viewId}.focus`);

    // Tell the provider to navigate to the specific resource
    provider.navigateTo(target.resourceType, target.resourceId);

    // Record in history
    const event: NavigationEvent = {
      from: fromModule ?? target.module,
      to: target,
      timestamp: Date.now(),
    };
    // Truncate forward history when navigating from middle
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(event);
    this.historyIndex = this.history.length - 1;

    this._onNavigate.fire(event);
  }

  async goBack(): Promise<void> {
    if (this.historyIndex <= 0) { return; }
    this.historyIndex--;
    const event = this.history[this.historyIndex];
    const target: NavigationTarget = { module: event.from };
    await this.navigate(target);
  }

  async goForward(): Promise<void> {
    if (this.historyIndex >= this.history.length - 1) { return; }
    this.historyIndex++;
    const event = this.history[this.historyIndex];
    await this.navigate(event.to);
  }

  /** Convert KasperModule id → VS Code view id */
  private moduleToViewId(module: KasperModule): string {
    const map: Record<KasperModule, string> = {
      'google-chat': 'kasper.googleChat',
      'google-meet': 'kasper.googleMeet',
      'google-calendar': 'kasper.googleCalendar',
      'github-org': 'kasper.githubOrg',
      'github-repos': 'kasper.githubRepos',
      'github-projects': 'kasper.githubProjects',
    };
    return map[module];
  }

  dispose(): void {
    this._onNavigate.dispose();
  }
}
