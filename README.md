# Kasper — Collaborative Development Hub

> VS Code extension that integrates **Google Chat**, **Google Meet**, **Google Calendar**, **GitHub Organization**, **GitHub Repos** and **GitHub Projects** into a unified sidebar workspace with cross-module alias-based navigation.

No more tab-switching. Write code, check your calendar, reply in chat, join a meeting, review a project board — all without leaving your editor.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Launching the Extension](#launching-the-extension)
- [User Interface Overview](#user-interface-overview)
  - [Activity Bar & Sidebar](#activity-bar--sidebar)
  - [Google Chat](#-google-chat)
  - [Google Meet](#-google-meet)
  - [Google Calendar](#-google-calendar)
  - [GitHub Organization](#-github-organization)
  - [GitHub Repos](#-github-repos)
  - [GitHub Projects](#-github-projects)
- [Alias System](#alias-system)
  - [Prefix Reference](#prefix-reference)
  - [How Aliases Work](#how-aliases-work)
  - [Using Aliases in Chat](#using-aliases-in-chat)
- [Cross-Module Navigation](#cross-module-navigation)
- [Commands](#commands)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Development](#development)
- [Roadmap](#roadmap)

---

## Quick Start

```bash
git clone https://github.com/swagalabs/Kasper.git
cd Kasper
npm install
npm run compile
```

Then press **F5** in VS Code to launch the Extension Development Host.

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | >= 18.x | Runtime |
| **npm** | >= 9.x | Package manager |
| **VS Code** | >= 1.85.0 | Host editor |
| **TypeScript** | >= 5.3 | Compilation (installed via npm) |

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/swagalabs/Kasper.git
cd Kasper
```

### 2. Install dependencies

```bash
npm install
```

### 3. Compile TypeScript

```bash
npm run compile
```

To watch for changes during development:

```bash
npm run watch
```

### 4. Verify build

After compilation, the `out/` directory should contain the compiled JavaScript:

```
out/
├── extension.js
├── types.js
├── alias/aliasManager.js
├── navigation/navigator.js
├── providers/*.js
├── services/mockData.js
└── webview/theme.js
```

---

## Launching the Extension

### Option A: VS Code Debug (recommended for development)

1. Open the `Kasper/` folder in VS Code
2. Press **F5** (or `Run → Start Debugging`)
3. A new VS Code window opens — the **Extension Development Host**
4. Click the **Kasper icon** in the Activity Bar (left sidebar)
5. All six panels appear in the sidebar

### Option B: Package as VSIX

```bash
npm install -g @vscode/vsce
vsce package
code --install-extension kasper-0.1.0.vsix
```

### First Launch Checklist

After the extension activates you should see:

- [x] **Kasper icon** appears in the Activity Bar (left side)
- [x] **Status bar** shows `$(pulse) Kasper` at the bottom left
- [x] **Six panels** visible when clicking the Kasper icon
- [x] **Console message**: `Kasper activated — collaborative development hub is ready`

---

## User Interface Overview

### Activity Bar & Sidebar

Kasper lives in the VS Code **sidebar**. Click the Kasper icon in the Activity Bar to reveal six collapsible panels:

```
┌──────────────────────────────────────────┐
│ ACTIVITY BAR │        SIDEBAR            │
│              │                           │
│  [Explorer]  │  ▾ Google Chat            │
│  [Search]    │  ▾ Google Meet            │
│  [Git]       │  ▾ Google Calendar        │
│  [Debug]     │  ▾ GitHub Organization    │
│ >[KASPER] ◄──│  ▾ GitHub Repos           │
│  [Extensions]│  ▾ GitHub Projects        │
│              │                           │
└──────────────────────────────────────────┘
```

Each panel is a **webview** — a mini web app rendered inside VS Code that matches your current color theme (dark/light).

---

### Google Chat

The Chat panel shows your Google Chat spaces and messages.

**Layout:**
- **Search box** — filter spaces and messages
- **Spaces list** — rooms (`#backend`, `#frontend`) and DMs (`@anna`), with unread badges
- **Message feed** — messages for the selected space, with avatars and timestamps
- **Message input** — type and send, use aliases inline

**Key features:**
- Click a space card to switch the message feed
- Aliases in messages are **clickable** — `$kasper-api` jumps to the GitHub Repos panel
- Type `@anna` in your message and it renders as a linked mention
- Unread badges (`new`) highlight active conversations

**Example message flow:**
```
@anna (09:15):  Запушила фікс для auth middleware, подивіться $kasper-api PR #42
                                                              ^^^^^^^^^^^^
                                                              Click → jumps to GitHub Repos

@dmytro (09:17): Добре, подивлюсь. @maxim можеш теж глянути?
                                    ^^^^^^
                                    Click → jumps to GitHub Org member profile

@maxim (09:20):  Вже дивлюсь. До речі, ~standup через 30 хвилин
                                         ^^^^^^^^
                                         Click → jumps to Google Meet
```

---

### Google Meet

The Meet panel lists today's meetings with real-time status.

**Layout:**
- **Date header** with meeting count badge
- **Meeting cards** — each showing title, alias, time, attendees, and Join button

**Status badges:**
| Badge | Meaning |
|-------|---------|
| `LIVE` (green) | Meeting is happening now |
| `in 15 min` (yellow) | Starting soon |
| `upcoming` (gray) | Scheduled for later |

**Attendee status icons:**
- ✅ Accepted
- ❌ Declined  
- ❓ Tentative

**Actions:**
- Click **Join Meeting** → opens Google Meet link in browser
- Click an **attendee alias** (`@anna`) → navigates to their profile in GitHub Org
- Recurring meetings show a 🔁 icon

---

### Google Calendar

The Calendar panel shows a timeline of today's events plus upcoming dates.

**Layout:**
- **Date header** with event count
- **Timeline** — hourly slots (08:00–17:00) with event cards placed at their time
- **Upcoming section** — events beyond today

**Visual indicators:**
- **Blue left border** — event is happening now
- **Dimmed (opacity)** — event has passed
- **Color coding** — each event has a color (blue, green, yellow, red)

**Event cards show:**
- Title and alias (`~standup`)
- Time range
- Attendees as clickable aliases
- Description with inline alias links
- **Join** button if a Meet link is attached

**Cross-module links:**
- `~standup` in any module → opens Calendar/Meet
- `!q2-roadmap` in event description → jumps to GitHub Projects
- Attendee aliases → jump to GitHub Org or Chat DM

---

### GitHub Organization

The Organization panel shows your GitHub org at a glance.

**Layout:**
- **Org card** — name, alias (`#swagalabs`), description, member/team counts
- **Teams section** — team cards with alias, description, member count
- **Members section** — searchable list with avatars, roles (admin/member)

**Actions:**
- Click a **team** → filter members by team
- Click a **member** → navigate to their Chat DM or see their assigned tasks
- Search box filters members by name or alias

---

### GitHub Repos

The Repos panel lists all organization repositories.

**Each repo card shows:**
- **Name** (clickable, in accent color)
- **Visibility** badge — `public` (gray) or `private` (yellow)
- **Description**
- **Language** with colored dot (TypeScript=blue, Go=cyan, HCL=purple)
- **Stats** — ⭐ stars, 🔗 forks, 📄 open issues
- **Last updated** — relative time ("45m ago", "2h ago")
- **Alias** and full name (`$kasper-api · swagalabs/kasper-api`)

---

### GitHub Projects

The Projects panel renders a **kanban board** for each GitHub Project.

**Layout:**
- **Project tabs** — switch between projects (`!q2-roadmap`, `!auth-migration`)
- **Project info card** — title, alias, description, total item count
- **Kanban columns** — Backlog → In Progress → Review → Done

**Each card shows:**
- **Title**
- **Labels** — color-coded badges (`security`, `feature`, `priority:high`)
- **Assignees** — clickable aliases (`@anna`, `@dmytro`)
- **Linked repo** — clickable alias (`$kasper-api`) → jumps to GitHub Repos
- **Issue number** — `#42` linking to the specific issue

**Column headers** are color-coded:
| Column | Color |
|--------|-------|
| Backlog | Gray |
| In Progress | Blue |
| Review | Yellow |
| Done | Green |

---

## Alias System

The alias system is the **core concept** of Kasper. Instead of passing raw URLs between modules, everything uses human-readable aliases.

### Prefix Reference

| Prefix | Type | Examples | Target Module |
|--------|------|----------|---------------|
| `@` | **People** | `@anna`, `@dmytro`, `@maxim` | Chat DM / GitHub Org |
| `#` | **Channels & Teams** | `#backend`, `#team-devops` | Chat Space / GitHub Team |
| `$` | **Repositories** | `$kasper`, `$kasper-api` | GitHub Repos |
| `!` | **Projects** | `!q2-roadmap`, `!auth-migration` | GitHub Projects |
| `~` | **Events & Meetings** | `~standup`, `~sprint-planning` | Calendar / Meet |

### How Aliases Work

```
User types "@anna" in Chat
        │
        ▼
┌─────────────────┐
│  AliasManager    │ ─── resolves "@anna" to:
│                  │     module: "google-chat"
│  Central registry│     resourceType: "user"
│  of all aliases  │     resourceId: "anna.k"
│                  │     displayName: "Анна Коваленко"
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Navigator      │ ─── focuses the target module
│                  │     tells provider to highlight resource
│  Cross-module    │     records in navigation history
│  routing engine  │
└─────────────────┘
```

Every alias is **registered** when data loads (from API or mock). Any module can **resolve** any alias — the system is fully cross-module.

### Using Aliases in Chat

When you type a message in Google Chat, aliases are automatically detected and rendered as clickable links:

```
Input:  "Hey @dmytro, check $kasper-api PR #42 before ~standup"

Renders: Hey @dmytro, check $kasper-api PR #42 before ~standup
              ^^^^^^^^       ^^^^^^^^^^^              ^^^^^^^^
              blue link      blue link                blue link
              → GitHub Org   → GitHub Repos           → Google Meet
```

---

## Cross-Module Navigation

Kasper keeps a **navigation history** — just like browser back/forward. When you click an alias, the navigator:

1. **Resolves** the alias → finds which module owns it
2. **Focuses** that module's panel in the sidebar
3. **Scrolls** to the specific resource (channel, repo, project card)
4. **Records** the navigation in history

This means you can:
- Read a chat message mentioning `$kasper-api` → click → land on the repo
- See `@anna` assigned to a project card → click → see her Chat DM
- Read about `~sprint-planning` in chat → click → see it in Calendar with "Join" button

### Quick Navigation (Command Palette)

Press **Ctrl+Shift+P** (or **Cmd+Shift+P** on macOS) and type:

```
Kasper: Navigate to...
```

This opens a **Quick Pick** showing all registered aliases with search:

```
┌───────────────────────────────────────────────┐
│ > Type an alias to navigate...                │
├───────────────────────────────────────────────┤
│ @anna        Анна Коваленко     google-chat   │
│ @dmytro      Дмитро Шевченко    google-chat   │
│ #backend     Backend Team        google-chat   │
│ $kasper      kasper              github-repos  │
│ $kasper-api  kasper-api          github-repos  │
│ !q2-roadmap  Q2 Roadmap         github-projects│
│ ~standup     Daily Standup       google-meet   │
│ ...                                           │
└───────────────────────────────────────────────┘
```

---

## Commands

All commands are available via the Command Palette (**Ctrl+Shift+P** / **Cmd+Shift+P**):

| Command | Description |
|---------|-------------|
| `Kasper: Navigate to...` | Quick Pick with all aliases — the fastest way to jump anywhere |
| `Kasper: Resolve Alias` | Enter an alias to see what it maps to, with option to navigate |
| `Kasper: Open Google Chat` | Focus the Google Chat panel |
| `Kasper: Open Google Meet` | Focus the Google Meet panel |
| `Kasper: Open Google Calendar` | Focus the Google Calendar panel |
| `Kasper: Open GitHub Organization` | Focus the GitHub Org panel |
| `Kasper: Open GitHub Repos` | Focus the GitHub Repos panel |
| `Kasper: Open GitHub Projects` | Focus the GitHub Projects panel |
| `Kasper: Authenticate` | Start OAuth2 flow (placeholder) |

---

## Configuration

Open VS Code Settings (**Ctrl+,**) and search for `kasper`:

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `kasper.github.organization` | string | `""` | GitHub organization name (e.g., `swagalabs`) |
| `kasper.github.token` | string | `""` | GitHub personal access token |
| `kasper.google.clientId` | string | `""` | Google OAuth2 client ID |
| `kasper.google.clientSecret` | string | `""` | Google OAuth2 client secret |

> **Note:** The current prototype uses mock data. Configuration is prepared for when real API integration is implemented.

---

## Project Structure

```
Kasper/
├── package.json                        # Extension manifest, commands, views, config
├── tsconfig.json                       # TypeScript compiler configuration
├── .vscodeignore                       # Files excluded from VSIX package
│
├── media/icons/
│   └── kasper.svg                      # Activity Bar icon
│
├── docs/screenshots/                   # SVG diagrams for this README
│
└── src/
    ├── extension.ts                    # Entry point — wires everything together
    ├── types.ts                        # TypeScript interfaces for all entities
    │
    ├── alias/
    │   └── aliasManager.ts             # Central alias registry & resolver
    │
    ├── navigation/
    │   └── navigator.ts                # Cross-module navigation with history
    │
    ├── providers/
    │   ├── googleChatProvider.ts        # Google Chat webview (spaces, messages)
    │   ├── googleMeetProvider.ts        # Google Meet webview (meetings, join)
    │   ├── googleCalendarProvider.ts    # Google Calendar webview (timeline)
    │   ├── githubOrgProvider.ts         # GitHub Organization (teams, members)
    │   ├── githubReposProvider.ts       # GitHub Repos (list with stats)
    │   └── githubProjectsProvider.ts    # GitHub Projects (kanban board)
    │
    ├── services/
    │   └── mockData.ts                 # Mock data simulating API responses
    │
    └── webview/
        └── theme.ts                    # Shared CSS, HTML wrapper, VS Code theme vars
```

---

## Development

### Build & Watch

```bash
# One-time build
npm run compile

# Watch mode — auto-recompiles on save
npm run watch
```

### Debug Workflow

1. Run `npm run watch` in a terminal
2. Press **F5** in VS Code
3. Make changes in `src/` → save → the Extension Development Host reloads

### Lint

```bash
npm run lint
```

### Adding a New Module

1. Create a provider in `src/providers/myModuleProvider.ts` implementing `KasperWebviewProvider`
2. Add a view entry in `package.json` under `contributes.views.kasper`
3. Register the provider in `src/extension.ts`
4. Register aliases for the module's resources in `src/services/mockData.ts`

---

## Roadmap

- [ ] **Real API integration** — connect to Google Workspace and GitHub APIs with OAuth2
- [ ] **Live data sync** — WebSocket / polling for real-time chat messages and notifications
- [ ] **Full VS Code fork** — custom branding, native layout (not just sidebar), deep editor integration
- [ ] **Notifications** — badge counts, toast notifications for new messages / meeting reminders
- [ ] **Search across modules** — unified search that queries all modules at once
- [ ] **Keyboard shortcuts** — quick-switch between modules without mouse
- [ ] **Alias autocomplete** — IntelliSense-style suggestions when typing aliases in chat
- [ ] **Persistent state** — remember which spaces/projects were open between sessions

---

<p align="center">
  Built by <a href="https://github.com/swagalabs">SwagaLabs</a>
</p>
