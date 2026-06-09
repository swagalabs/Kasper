import * as vscode from 'vscode';
import { KasperModule, KasperWebviewProvider } from '../types';
import { AliasManager } from '../alias/aliasManager';
import { githubRepos } from '../services/mockData';
import { wrapHtml } from '../webview/theme';

export class GitHubReposProvider implements KasperWebviewProvider {
  readonly moduleId: KasperModule = 'github-repos';
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

    const langColors: Record<string, string> = {
      TypeScript: '#3178c6',
      Go: '#00add8',
      HCL: '#844fba',
      MDX: '#fcb32c',
    };

    const reposHtml = githubRepos.map(r => {
      const langDot = langColors[r.language]
        ? `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${langColors[r.language]}"></span>`
        : '';
      const visibility = r.isPrivate
        ? '<span class="badge badge-yellow">private</span>'
        : '<span class="badge badge-gray">public</span>';
      const updated = this.timeAgo(new Date(r.updatedAt));

      return `
        <div class="card" onclick="navigate('${r.alias}')">
          <div class="row" style="justify-content:space-between;margin-bottom:4px;">
            <div class="row">
              <span style="font-weight:700;font-size:13px;color:var(--kasper-accent)">${r.name}</span>
              ${visibility}
            </div>
          </div>
          <div style="font-size:12px;margin-bottom:6px;">${r.description}</div>
          <div class="row" style="font-size:11px;gap:12px;">
            <span class="row" style="gap:4px">${langDot} ${r.language}</span>
            <span title="Stars">&#11088; ${r.stars}</span>
            <span title="Forks">&#128268; ${r.forks}</span>
            <span title="Open issues">&#128196; ${r.openIssues}</span>
            <span class="muted">updated ${updated}</span>
          </div>
          <div class="muted" style="margin-top:4px">
            ${r.alias} &middot; ${r.fullName} &middot; ${r.defaultBranch}
          </div>
        </div>`;
    }).join('');

    const totalStars = githubRepos.reduce((s, r) => s + r.stars, 0);
    const totalIssues = githubRepos.reduce((s, r) => s + r.openIssues, 0);

    const body = `
      <h2>&#128230; GitHub Repos</h2>
      <div class="row" style="margin-bottom:10px;gap:12px;">
        <span class="badge badge-gray">${githubRepos.length} repos</span>
        <span class="muted">&#11088; ${totalStars} stars</span>
        <span class="muted">&#128196; ${totalIssues} open issues</span>
      </div>
      <input class="search-box" placeholder="Search repositories..." />
      ${reposHtml}
    `;

    this._view.webview.html = wrapHtml('GitHub Repos', body);
  }

  private timeAgo(date: Date): string {
    const now = new Date('2026-06-10T10:00:00Z');
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 60) { return `${diffMin}m ago`; }
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) { return `${diffH}h ago`; }
    return `${Math.floor(diffH / 24)}d ago`;
  }
}
