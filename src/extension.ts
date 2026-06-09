import * as vscode from 'vscode';
import { AliasManager } from './alias/aliasManager';
import { Navigator } from './navigation/navigator';
import { generateAliases } from './services/mockData';

import { GoogleChatProvider } from './providers/googleChatProvider';
import { GoogleMeetProvider } from './providers/googleMeetProvider';
import { GoogleCalendarProvider } from './providers/googleCalendarProvider';
import { GitHubOrgProvider } from './providers/githubOrgProvider';
import { GitHubReposProvider } from './providers/githubReposProvider';
import { GitHubProjectsProvider } from './providers/githubProjectsProvider';
import { KasperModule } from './types';

export function activate(context: vscode.ExtensionContext) {
  // ─── Core services ────────────────────────────────────────────────
  const aliasManager = new AliasManager();
  const navigator = new Navigator(aliasManager);

  // Seed aliases from mock data (in production this comes from APIs)
  aliasManager.registerBatch(generateAliases());

  // Shared navigation handler — every provider calls this when a user
  // clicks an alias inside its webview.
  const handleNavigate = (alias: string) => {
    const entry = aliasManager.resolve(alias);
    if (entry) {
      navigator.navigate({
        module: entry.module,
        resourceType: entry.resourceType,
        resourceId: entry.resourceId,
        alias,
      });
    } else {
      vscode.window.showWarningMessage(`Unknown alias: ${alias}`);
    }
  };

  // ─── Register providers ───────────────────────────────────────────
  const chatProvider = new GoogleChatProvider(context.extensionUri, aliasManager, handleNavigate);
  const meetProvider = new GoogleMeetProvider(context.extensionUri, aliasManager, handleNavigate);
  const calendarProvider = new GoogleCalendarProvider(context.extensionUri, aliasManager, handleNavigate);
  const orgProvider = new GitHubOrgProvider(context.extensionUri, aliasManager, handleNavigate);
  const reposProvider = new GitHubReposProvider(context.extensionUri, aliasManager, handleNavigate);
  const projectsProvider = new GitHubProjectsProvider(context.extensionUri, aliasManager, handleNavigate);

  // Register with VS Code
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('kasper.googleChat', chatProvider),
    vscode.window.registerWebviewViewProvider('kasper.googleMeet', meetProvider),
    vscode.window.registerWebviewViewProvider('kasper.googleCalendar', calendarProvider),
    vscode.window.registerWebviewViewProvider('kasper.githubOrg', orgProvider),
    vscode.window.registerWebviewViewProvider('kasper.githubRepos', reposProvider),
    vscode.window.registerWebviewViewProvider('kasper.githubProjects', projectsProvider),
  );

  // Register with navigator for cross-module navigation
  navigator.registerProvider(chatProvider);
  navigator.registerProvider(meetProvider);
  navigator.registerProvider(calendarProvider);
  navigator.registerProvider(orgProvider);
  navigator.registerProvider(reposProvider);
  navigator.registerProvider(projectsProvider);

  // ─── Commands ─────────────────────────────────────────────────────
  const moduleCommands: Record<string, KasperModule> = {
    'kasper.openChat': 'google-chat',
    'kasper.openMeet': 'google-meet',
    'kasper.openCalendar': 'google-calendar',
    'kasper.openGithubOrg': 'github-org',
    'kasper.openGithubRepos': 'github-repos',
    'kasper.openGithubProjects': 'github-projects',
  };

  for (const [command, module] of Object.entries(moduleCommands)) {
    context.subscriptions.push(
      vscode.commands.registerCommand(command, () => {
        navigator.navigate({ module });
      })
    );
  }

  // Quick-pick navigation command — type an alias to jump anywhere
  context.subscriptions.push(
    vscode.commands.registerCommand('kasper.navigate', async () => {
      const allAliases = aliasManager.getAll();
      const items = allAliases.map(a => ({
        label: a.alias,
        description: a.displayName,
        detail: `${a.module} / ${a.resourceType}`,
        entry: a,
      }));

      const pick = await vscode.window.showQuickPick(items, {
        placeHolder: 'Type an alias to navigate (e.g. @anna, #backend, $kasper, ~standup, !q2-roadmap)',
        matchOnDescription: true,
        matchOnDetail: true,
      });

      if (pick) {
        handleNavigate(pick.entry.alias);
      }
    })
  );

  // Resolve alias command — show details about an alias
  context.subscriptions.push(
    vscode.commands.registerCommand('kasper.resolveAlias', async () => {
      const input = await vscode.window.showInputBox({
        prompt: 'Enter an alias to resolve',
        placeHolder: '@anna, #backend, $kasper, etc.',
      });
      if (input) {
        const entry = aliasManager.resolve(input);
        if (entry) {
          const action = await vscode.window.showInformationMessage(
            `${entry.alias} → ${entry.displayName} (${entry.module}/${entry.resourceType})`,
            'Navigate',
          );
          if (action === 'Navigate') {
            handleNavigate(entry.alias);
          }
        } else {
          vscode.window.showWarningMessage(`No alias found for "${input}"`);
        }
      }
    })
  );

  // Auth placeholder
  context.subscriptions.push(
    vscode.commands.registerCommand('kasper.authenticate', () => {
      vscode.window.showInformationMessage(
        'Kasper: Authentication flow would start here (Google OAuth2 + GitHub PAT)'
      );
    })
  );

  // ─── Status bar ───────────────────────────────────────────────────
  const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBar.text = '$(pulse) Kasper';
  statusBar.tooltip = 'Kasper — Navigate to module';
  statusBar.command = 'kasper.navigate';
  statusBar.show();
  context.subscriptions.push(statusBar);

  // ─── Done ─────────────────────────────────────────────────────────
  context.subscriptions.push({ dispose: () => { aliasManager.dispose(); navigator.dispose(); } });

  console.log('Kasper activated — collaborative development hub is ready');
}

export function deactivate() {}
