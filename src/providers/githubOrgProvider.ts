import * as vscode from 'vscode';
import { KasperModule, KasperWebviewProvider } from '../types';
import { AliasManager } from '../alias/aliasManager';
import { githubOrg } from '../services/mockData';
import { wrapHtml } from '../webview/theme';

export class GitHubOrgProvider implements KasperWebviewProvider {
  readonly moduleId: KasperModule = 'github-org';
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
    });
    this.render();
  }

  refresh(): void { this.render(); }
  navigateTo(): void { this.render(); }

  private render(): void {
    if (!this._view) { return; }
    const org = githubOrg;

    const membersHtml = org.members.map(m => {
      const initials = m.name.split(' ').map(w => w[0]).join('').slice(0, 2);
      const roleBadge = m.role === 'admin'
        ? '<span class="badge badge-yellow">admin</span>'
        : '<span class="badge badge-gray">member</span>';
      return `
        <div class="card" onclick="navigate('${m.alias}')">
          <div class="row">
            <div class="avatar">${initials}</div>
            <div class="column" style="flex:1">
              <span style="font-weight:600;font-size:12px">${m.name}</span>
              <span class="muted">${m.alias} &middot; ${m.login}</span>
            </div>
            ${roleBadge}
          </div>
        </div>`;
    }).join('');

    const teamsHtml = org.teams.map(t => `
      <div class="card" onclick="navigate('${t.alias}')">
        <div class="row" style="justify-content:space-between">
          <div class="column">
            <span style="font-weight:600;font-size:12px">${t.name}</span>
            <span class="muted">${t.alias} &middot; ${t.description}</span>
          </div>
          <span class="badge badge-gray">${t.memberCount}</span>
        </div>
      </div>
    `).join('');

    const body = `
      <h2>&#127969; GitHub Organization</h2>

      <div class="card" style="border-color:var(--kasper-accent);">
        <div class="row" style="gap:12px;">
          <div class="avatar" style="width:40px;height:40px;font-size:16px;border-radius:8px;">SL</div>
          <div class="column">
            <span style="font-weight:700;font-size:14px">${org.name}</span>
            <span class="muted">${org.alias} &middot; ${org.login}</span>
            <span style="font-size:12px;margin-top:2px">${org.description}</span>
          </div>
        </div>
        <div class="row" style="margin-top:8px;gap:12px;">
          <span class="muted">&#128101; ${org.members.length} members</span>
          <span class="muted">&#128736; ${org.teams.length} teams</span>
        </div>
      </div>

      <h3>Teams</h3>
      ${teamsHtml}

      <h3>Members</h3>
      <input class="search-box" placeholder="Search members..." />
      ${membersHtml}
    `;

    this._view.webview.html = wrapHtml('GitHub Organization', body);
  }
}
