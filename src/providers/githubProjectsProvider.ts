import * as vscode from 'vscode';
import { KasperModule, KasperWebviewProvider } from '../types';
import { AliasManager } from '../alias/aliasManager';
import { githubProjects } from '../services/mockData';
import { wrapHtml } from '../webview/theme';

export class GitHubProjectsProvider implements KasperWebviewProvider {
  readonly moduleId: KasperModule = 'github-projects';
  private _view?: vscode.WebviewView;
  private selectedProjectId: number = githubProjects[0].id;

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
      if (msg.type === 'action' && msg.name === 'selectProject') {
        this.selectedProjectId = Number(msg.data);
        this.render();
      }
    });
    this.render();
  }

  refresh(): void { this.render(); }

  navigateTo(resourceType?: string, resourceId?: string): void {
    if (resourceType === 'project' && resourceId) {
      this.selectedProjectId = Number(resourceId);
    }
    this.render();
  }

  private render(): void {
    if (!this._view) { return; }

    const project = githubProjects.find(p => p.id === this.selectedProjectId) ?? githubProjects[0];

    // Project selector tabs
    const tabsHtml = githubProjects.map(p => {
      const active = p.id === this.selectedProjectId
        ? 'background:var(--kasper-accent);color:white;border-color:var(--kasper-accent);'
        : '';
      return `<button class="btn" style="${active}" onclick="action('selectProject','${p.id}')">${p.alias} ${p.title}</button>`;
    }).join('');

    // Kanban columns
    const colColors: Record<string, string> = {
      'Backlog': 'var(--vscode-descriptionForeground)',
      'Todo': 'var(--vscode-descriptionForeground)',
      'In Progress': '#4285f4',
      'Review': '#fbbc05',
      'Done': '#34a853',
    };

    const columnsHtml = project.columns.map(col => {
      const borderColor = colColors[col.name] ?? 'var(--kasper-accent)';
      const cardsHtml = col.cards.map(card => {
        const labelsHtml = card.labels.map(l =>
          `<span class="badge" style="background:#${l.color}22;color:#${l.color}">${l.name}</span>`
        ).join(' ');

        const assigneesHtml = card.assignees.map(a =>
          `<span class="alias" onclick="navigate('${a}')">${a}</span>`
        ).join(' ');

        const repoLink = card.linkedRepo
          ? `<span class="alias" onclick="navigate('${card.linkedRepo}')" style="font-size:10px">${card.linkedRepo}</span>`
          : '';
        const issueLink = card.linkedIssue
          ? `<span class="muted" style="font-size:10px">#${card.linkedIssue}</span>`
          : '';

        return `
          <div class="card" style="margin:0;">
            <div style="font-weight:600;font-size:12px;margin-bottom:4px;">${card.title}</div>
            <div style="font-size:11px;margin-bottom:4px;">${labelsHtml}</div>
            <div class="row" style="justify-content:space-between;font-size:11px;">
              <div>${assigneesHtml}</div>
              <div class="row" style="gap:4px">${repoLink} ${issueLink}</div>
            </div>
          </div>`;
      }).join('');

      return `
        <div class="kanban-col">
          <div class="kanban-col-header" style="border-bottom-color:${borderColor}">
            ${col.name} <span class="badge badge-gray" style="margin-left:4px">${col.cards.length}</span>
          </div>
          <div class="kanban-cards">
            ${cardsHtml || '<span class="muted" style="padding:8px;font-size:11px">No items</span>'}
          </div>
        </div>`;
    }).join('');

    const totalCards = project.columns.reduce((s, c) => s + c.cards.length, 0);

    const body = `
      <h2>&#128203; GitHub Projects</h2>
      <div class="row" style="margin-bottom:10px;gap:4px;flex-wrap:wrap;">
        ${tabsHtml}
      </div>

      <div class="card" style="border-color:var(--kasper-accent);margin-bottom:12px;">
        <div class="row" style="justify-content:space-between;">
          <div class="column">
            <span style="font-weight:700">${project.title}</span>
            <span class="muted">${project.alias} &middot; ${project.description}</span>
          </div>
          <span class="badge badge-blue">${totalCards} items</span>
        </div>
      </div>

      <div class="kanban">
        ${columnsHtml}
      </div>
    `;

    this._view.webview.html = wrapHtml('GitHub Projects', body);
  }
}
