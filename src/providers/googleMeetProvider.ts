import * as vscode from 'vscode';
import { KasperModule, KasperWebviewProvider } from '../types';
import { AliasManager } from '../alias/aliasManager';
import { meetings } from '../services/mockData';
import { wrapHtml } from '../webview/theme';

export class GoogleMeetProvider implements KasperWebviewProvider {
  readonly moduleId: KasperModule = 'google-meet';
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
      if (msg.type === 'action' && msg.name === 'joinMeet') {
        vscode.env.openExternal(vscode.Uri.parse(msg.data));
      }
    });
    this.render();
  }

  refresh(): void { this.render(); }
  navigateTo(): void { this.render(); }

  private render(): void {
    if (!this._view) { return; }

    const now = new Date('2026-06-10T09:45:00Z');

    const meetingsHtml = meetings.map(m => {
      const start = new Date(m.startTime);
      const end = new Date(m.endTime);
      const startStr = start.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
      const endStr = end.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });

      const diffMin = Math.round((start.getTime() - now.getTime()) / 60000);
      let timeBadge = '';
      if (diffMin > 0 && diffMin <= 15) {
        timeBadge = `<span class="badge badge-yellow">in ${diffMin} min</span>`;
      } else if (diffMin <= 0 && now < end) {
        timeBadge = `<span class="badge badge-green">LIVE</span>`;
      } else if (diffMin > 15) {
        timeBadge = `<span class="badge badge-gray">upcoming</span>`;
      }

      const attendeesHtml = m.attendees.map(a => {
        const statusIcon = a.status === 'accepted' ? '&#9989;' : a.status === 'declined' ? '&#10060;' : '&#10067;';
        return `<span class="alias" onclick="navigate('${a.alias}')" title="${a.status}">${statusIcon} ${a.alias}</span>`;
      }).join('&nbsp;&nbsp;');

      const recurIcon = m.isRecurring ? '<span title="Recurring">&#128257;</span>' : '';

      return `
        <div class="card">
          <div class="row" style="justify-content:space-between;margin-bottom:6px;">
            <div class="row">
              <span style="font-size:16px">&#128249;</span>
              <div class="column">
                <span style="font-weight:600">${m.title} ${recurIcon}</span>
                <span class="muted">${m.alias} &middot; ${startStr} – ${endStr}</span>
              </div>
            </div>
            ${timeBadge}
          </div>
          <div style="font-size:11px;margin:4px 0 8px">${attendeesHtml}</div>
          <button class="btn btn-primary" onclick="action('joinMeet','${m.meetLink}')">
            &#127909; Join Meeting
          </button>
        </div>`;
    }).join('');

    const body = `
      <h2>&#128249; Google Meet</h2>
      <div class="row" style="margin-bottom:10px;">
        <span class="muted">Today, June 10 2026</span>
        <span class="badge badge-blue">${meetings.length} meetings</span>
      </div>
      ${meetingsHtml}
    `;

    this._view.webview.html = wrapHtml('Google Meet', body);
  }
}
