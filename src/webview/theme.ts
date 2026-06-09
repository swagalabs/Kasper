/**
 * Shared CSS and HTML helpers for all Kasper webviews.
 * Uses VS Code CSS variables so the panels match the user's theme.
 */
export function getBaseStyles(): string {
  return /*css*/ `
    :root {
      --kasper-accent: #4285f4;
      --kasper-accent-green: #34a853;
      --kasper-accent-yellow: #fbbc05;
      --kasper-accent-red: #ea4335;
      --kasper-border: var(--vscode-panel-border, #333);
      --kasper-radius: 6px;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: var(--vscode-font-family, -apple-system, BlinkMacSystemFont, sans-serif);
      font-size: var(--vscode-font-size, 13px);
      color: var(--vscode-foreground);
      background: var(--vscode-sideBar-background, var(--vscode-editor-background));
      padding: 8px;
      line-height: 1.5;
    }

    h2 {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 8px;
      color: var(--vscode-foreground);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    h3 {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--vscode-descriptionForeground);
      margin: 12px 0 6px;
    }

    .card {
      background: var(--vscode-editor-background);
      border: 1px solid var(--kasper-border);
      border-radius: var(--kasper-radius);
      padding: 10px;
      margin-bottom: 8px;
      cursor: pointer;
      transition: border-color 0.15s;
    }
    .card:hover {
      border-color: var(--kasper-accent);
    }

    .alias {
      color: var(--kasper-accent);
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
    }
    .alias:hover {
      text-decoration: underline;
    }

    .badge {
      display: inline-block;
      font-size: 10px;
      padding: 1px 6px;
      border-radius: 10px;
      font-weight: 600;
    }
    .badge-blue  { background: rgba(66,133,244,0.15); color: #4285f4; }
    .badge-green { background: rgba(52,168,83,0.15);  color: #34a853; }
    .badge-yellow{ background: rgba(251,188,5,0.15);  color: #fbbc05; }
    .badge-red   { background: rgba(234,67,53,0.15);  color: #ea4335; }
    .badge-gray  { background: var(--vscode-badge-background); color: var(--vscode-badge-foreground); }

    .avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--kasper-accent);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .column {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .muted {
      color: var(--vscode-descriptionForeground);
      font-size: 11px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border: 1px solid var(--kasper-border);
      border-radius: var(--kasper-radius);
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      font-size: 11px;
      cursor: pointer;
      font-family: inherit;
    }
    .btn:hover {
      background: var(--vscode-button-hoverBackground);
    }
    .btn-primary {
      background: var(--kasper-accent);
      border-color: var(--kasper-accent);
      color: white;
    }

    .search-box {
      width: 100%;
      padding: 6px 8px;
      border: 1px solid var(--kasper-border);
      border-radius: var(--kasper-radius);
      background: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      font-family: inherit;
      font-size: 12px;
      margin-bottom: 10px;
      outline: none;
    }
    .search-box:focus {
      border-color: var(--kasper-accent);
    }

    .separator {
      height: 1px;
      background: var(--kasper-border);
      margin: 10px 0;
    }

    .kanban {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 8px;
    }
    .kanban-col {
      min-width: 200px;
      flex: 1;
    }
    .kanban-col-header {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 6px 8px;
      border-radius: var(--kasper-radius) var(--kasper-radius) 0 0;
      background: var(--vscode-editor-background);
      border: 1px solid var(--kasper-border);
      border-bottom: 2px solid var(--kasper-accent);
    }
    .kanban-cards {
      border: 1px solid var(--kasper-border);
      border-top: none;
      border-radius: 0 0 var(--kasper-radius) var(--kasper-radius);
      padding: 6px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      min-height: 60px;
    }
  `;
}

export function wrapHtml(title: string, body: string, script?: string): string {
  return /*html*/ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title}</title>
  <style>${getBaseStyles()}</style>
</head>
<body>
  ${body}
  <script>
    const vscode = acquireVsCodeApi();
    function navigate(alias) {
      vscode.postMessage({ type: 'navigate', alias });
    }
    function action(name, data) {
      vscode.postMessage({ type: 'action', name, data });
    }
    ${script ?? ''}
  </script>
</body>
</html>`;
}
