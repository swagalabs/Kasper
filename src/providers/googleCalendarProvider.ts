import * as vscode from 'vscode';
import { KasperModule, KasperWebviewProvider } from '../types';
import { AliasManager } from '../alias/aliasManager';
import { calendarEvents } from '../services/mockData';
import { wrapHtml } from '../webview/theme';

export class GoogleCalendarProvider implements KasperWebviewProvider {
  readonly moduleId: KasperModule = 'google-calendar';
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
    const hours = Array.from({ length: 10 }, (_, i) => i + 8); // 8:00 – 17:00

    // Group events by day
    const todayEvents = calendarEvents.filter(e => {
      const d = new Date(e.startTime);
      return d.toDateString() === now.toDateString();
    });

    const upcomingEvents = calendarEvents.filter(e => {
      const d = new Date(e.startTime);
      return d > now && d.toDateString() !== now.toDateString();
    });

    const timelineHtml = hours.map(h => {
      const hStr = `${String(h).padStart(2, '0')}:00`;
      const eventsAtHour = todayEvents.filter(e => new Date(e.startTime).getHours() === h);

      const eventBlocks = eventsAtHour.map(e => {
        const start = new Date(e.startTime);
        const end = new Date(e.endTime);
        const startStr = start.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
        const endStr = end.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
        const isPast = end < now;
        const isCurrent = start <= now && end > now;
        const borderStyle = isCurrent ? 'border-left: 3px solid var(--kasper-accent);' : isPast ? 'opacity: 0.5;' : '';

        const attendeesStr = e.attendees.map(a =>
          `<span class="alias" onclick="navigate('${a}')">${a}</span>`
        ).join(' ');

        const meetBtn = e.meetLink
          ? `<button class="btn" onclick="action('joinMeet','${e.meetLink}')" style="font-size:10px;padding:2px 6px;">&#127909; Join</button>`
          : '';

        return `
          <div class="card" style="${borderStyle}background:${e.color ?? 'var(--kasper-accent)'}15;">
            <div class="row" style="justify-content:space-between;">
              <span style="font-weight:600;font-size:12px">${e.title}</span>
              ${meetBtn}
            </div>
            <span class="muted">${e.alias} &middot; ${startStr} – ${endStr}</span>
            ${e.attendees.length ? `<div style="font-size:11px;margin-top:4px">${attendeesStr}</div>` : ''}
            ${e.description ? `<div class="muted" style="margin-top:4px">${this.renderAliases(e.description)}</div>` : ''}
          </div>`;
      }).join('');

      return `
        <div style="display:flex;gap:8px;min-height:32px;margin-bottom:2px;">
          <span class="muted" style="width:40px;flex-shrink:0;text-align:right;padding-top:2px">${hStr}</span>
          <div style="flex:1;border-left:1px solid var(--kasper-border);padding-left:8px;">
            ${eventBlocks}
          </div>
        </div>`;
    }).join('');

    const upcomingHtml = upcomingEvents.map(e => {
      const d = new Date(e.startTime);
      const dateStr = d.toLocaleDateString('uk-UA', { weekday: 'short', month: 'short', day: 'numeric' });
      const timeStr = d.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
      return `
        <div class="card" style="background:${e.color ?? 'var(--kasper-accent)'}10;">
          <span style="font-weight:600;font-size:12px">${e.title}</span>
          <span class="muted">${e.alias} &middot; ${dateStr}, ${timeStr}</span>
          ${e.description ? `<div class="muted" style="margin-top:2px">${this.renderAliases(e.description)}</div>` : ''}
        </div>`;
    }).join('');

    const body = `
      <h2>&#128197; Google Calendar</h2>
      <div class="row" style="margin-bottom:10px;justify-content:space-between;">
        <span style="font-weight:600">Today — June 10, 2026</span>
        <span class="badge badge-blue">${todayEvents.length} events</span>
      </div>

      <div style="max-height:400px;overflow-y:auto;">
        ${timelineHtml}
      </div>

      ${upcomingEvents.length ? `
        <div class="separator"></div>
        <h3>Upcoming</h3>
        ${upcomingHtml}
      ` : ''}
    `;

    this._view.webview.html = wrapHtml('Google Calendar', body);
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
