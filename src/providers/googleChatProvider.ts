import * as vscode from 'vscode';
import { KasperModule, KasperWebviewProvider } from '../types';
import { AliasManager } from '../alias/aliasManager';
import { chatSpaces, chatMessages } from '../services/mockData';
import { wrapHtml } from '../webview/theme';

export class GoogleChatProvider implements KasperWebviewProvider {
  readonly moduleId: KasperModule = 'google-chat';
  private _view?: vscode.WebviewView;
  private selectedSpaceId: string = chatSpaces[0].id;

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
      if (msg.type === 'action' && msg.name === 'selectSpace') {
        this.selectedSpaceId = msg.data;
        this.render();
      }
      if (msg.type === 'action' && msg.name === 'sendMessage') {
        vscode.window.showInformationMessage(`[Kasper Chat] Message sent to ${msg.data.space}`);
      }
    });
    this.render();
  }

  refresh(): void { this.render(); }

  navigateTo(resourceType?: string, resourceId?: string): void {
    if (resourceType === 'channel' && resourceId) {
      this.selectedSpaceId = resourceId;
    }
    this.render();
  }

  private render(): void {
    if (!this._view) { return; }
    const spaces = chatSpaces;
    const messages = chatMessages.filter(m => m.spaceId === this.selectedSpaceId);
    const currentSpace = spaces.find(s => s.id === this.selectedSpaceId);

    const spaceListHtml = spaces.map(s => {
      const active = s.id === this.selectedSpaceId ? 'border-color: var(--kasper-accent);' : '';
      const icon = s.type === 'DM' ? '&#128100;' : '&#128101;';
      const unread = s.id === 'sp-1' || s.id === 'sp-4' ? '<span class="badge badge-blue">new</span>' : '';
      return `
        <div class="card" style="${active}" onclick="action('selectSpace','${s.id}')">
          <div class="row">
            <span>${icon}</span>
            <div class="column">
              <span style="font-weight:600;font-size:12px">${s.name}</span>
              <span class="muted">${s.alias} ${s.memberCount ? '&middot; ' + s.memberCount + ' members' : ''}</span>
            </div>
            ${unread}
          </div>
        </div>`;
    }).join('');

    const messagesHtml = messages.map(m => {
      const text = this.renderAliases(m.text);
      const time = new Date(m.timestamp).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
      const initials = m.sender.split(' ').map(w => w[0]).join('').slice(0, 2);
      return `
        <div style="display:flex;gap:8px;margin-bottom:10px;">
          <div class="avatar">${initials}</div>
          <div class="column" style="flex:1">
            <div class="row">
              <span class="alias" onclick="navigate('${m.senderAlias}')" style="font-size:12px">${m.sender}</span>
              <span class="muted">${time}</span>
            </div>
            <div style="font-size:13px;margin-top:2px">${text}</div>
          </div>
        </div>`;
    }).join('');

    const body = `
      <h2>&#128172; Google Chat</h2>
      <input class="search-box" placeholder="Search spaces & messages..." />

      <h3>Spaces</h3>
      ${spaceListHtml}

      <div class="separator"></div>

      <h3>${currentSpace?.name ?? 'Messages'} <span class="muted">${currentSpace?.alias ?? ''}</span></h3>
      <div style="max-height:400px;overflow-y:auto;padding:4px 0;">
        ${messagesHtml.length ? messagesHtml : '<span class="muted">No messages yet</span>'}
      </div>

      <div style="margin-top:8px;display:flex;gap:4px;">
        <input class="search-box" id="msgInput" placeholder="Type a message... (use aliases like @anna, $kasper)" style="margin:0;flex:1" />
        <button class="btn btn-primary" onclick="sendMsg()">Send</button>
      </div>
    `;

    const script = `
      function sendMsg() {
        const input = document.getElementById('msgInput');
        if (input.value.trim()) {
          action('sendMessage', { space: '${this.selectedSpaceId}', text: input.value });
          input.value = '';
        }
      }
      document.getElementById('msgInput').addEventListener('keypress', e => {
        if (e.key === 'Enter') sendMsg();
      });
    `;

    this._view.webview.html = wrapHtml('Google Chat', body, script);
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
