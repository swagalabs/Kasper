import {
  ChatSpace, ChatMessage, Meeting, CalendarEvent,
  GitHubOrganization, GitHubRepo, GitHubProject, AliasEntry,
} from '../types';

// ─── People ───────────────────────────────────────────────────────────
const people = [
  { login: 'anna.k', name: 'Анна Коваленко', alias: '@anna' },
  { login: 'dmytro.s', name: 'Дмитро Шевченко', alias: '@dmytro' },
  { login: 'olena.p', name: 'Олена Петренко', alias: '@olena' },
  { login: 'maxim.b', name: 'Максим Бондаренко', alias: '@maxim' },
  { login: 'iryna.l', name: 'Ірина Литвиненко', alias: '@iryna' },
  { login: 'sergiy.m', name: 'Сергій Мельник', alias: '@sergiy' },
];

// ─── Chat Spaces ──────────────────────────────────────────────────────
export const chatSpaces: ChatSpace[] = [
  { id: 'sp-1', name: 'Backend Team', alias: '#backend', type: 'ROOM', memberCount: 8 },
  { id: 'sp-2', name: 'Frontend Squad', alias: '#frontend', type: 'ROOM', memberCount: 6 },
  { id: 'sp-3', name: 'DevOps & Infra', alias: '#devops', type: 'ROOM', memberCount: 4 },
  { id: 'sp-4', name: 'General', alias: '#general', type: 'ROOM', memberCount: 15 },
  { id: 'sp-5', name: 'Анна Коваленко', alias: '@anna', type: 'DM' },
  { id: 'sp-6', name: 'Дмитро Шевченко', alias: '@dmytro', type: 'DM' },
];

export const chatMessages: ChatMessage[] = [
  {
    id: 'msg-1', spaceId: 'sp-1', sender: 'Анна Коваленко', senderAlias: '@anna',
    text: 'Запушила фікс для auth middleware, подивіться $kasper-api PR #42',
    timestamp: '2026-06-10T09:15:00Z',
  },
  {
    id: 'msg-2', spaceId: 'sp-1', sender: 'Дмитро Шевченко', senderAlias: '@dmytro',
    text: 'Добре, подивлюсь. @maxim можеш теж глянути? Це стосується !auth-migration',
    timestamp: '2026-06-10T09:17:00Z',
  },
  {
    id: 'msg-3', spaceId: 'sp-1', sender: 'Максим Бондаренко', senderAlias: '@maxim',
    text: 'Вже дивлюсь. До речі, ~standup через 30 хвилин',
    timestamp: '2026-06-10T09:20:00Z',
  },
  {
    id: 'msg-4', spaceId: 'sp-2', sender: 'Олена Петренко', senderAlias: '@olena',
    text: 'Оновила компоненти у $kasper-ui, тепер sidebar рендериться без лагів',
    timestamp: '2026-06-10T09:22:00Z',
  },
  {
    id: 'msg-5', spaceId: 'sp-2', sender: 'Ірина Литвиненко', senderAlias: '@iryna',
    text: 'Супер! Подивлюсь на ~design-review чи все ок з новим дизайном',
    timestamp: '2026-06-10T09:25:00Z',
  },
  {
    id: 'msg-6', spaceId: 'sp-3', sender: 'Сергій Мельник', senderAlias: '@sergiy',
    text: 'CI пайплайн для $kasper-infra зелений, можна деплоїти на стейджинг',
    timestamp: '2026-06-10T09:30:00Z',
  },
  {
    id: 'msg-7', spaceId: 'sp-4', sender: 'Анна Коваленко', senderAlias: '@anna',
    text: 'Нагадую: ~sprint-planning сьогодні о 14:00. Перегляньте !q2-roadmap перед мітингом',
    timestamp: '2026-06-10T09:35:00Z',
  },
];

// ─── Meetings ─────────────────────────────────────────────────────────
export const meetings: Meeting[] = [
  {
    id: 'meet-1', title: 'Daily Standup', alias: '~standup',
    meetLink: 'https://meet.google.com/abc-defg-hij',
    startTime: '2026-06-10T10:00:00Z', endTime: '2026-06-10T10:15:00Z',
    attendees: [
      { name: 'Анна Коваленко', alias: '@anna', status: 'accepted' },
      { name: 'Дмитро Шевченко', alias: '@dmytro', status: 'accepted' },
      { name: 'Максим Бондаренко', alias: '@maxim', status: 'accepted' },
      { name: 'Олена Петренко', alias: '@olena', status: 'tentative' },
    ],
    isRecurring: true,
  },
  {
    id: 'meet-2', title: 'Design Review', alias: '~design-review',
    meetLink: 'https://meet.google.com/klm-nopq-rst',
    startTime: '2026-06-10T11:00:00Z', endTime: '2026-06-10T11:45:00Z',
    attendees: [
      { name: 'Олена Петренко', alias: '@olena', status: 'accepted' },
      { name: 'Ірина Литвиненко', alias: '@iryna', status: 'accepted' },
      { name: 'Анна Коваленко', alias: '@anna', status: 'declined' },
    ],
    isRecurring: false,
  },
  {
    id: 'meet-3', title: 'Sprint Planning', alias: '~sprint-planning',
    meetLink: 'https://meet.google.com/uvw-xyza-bcd',
    startTime: '2026-06-10T14:00:00Z', endTime: '2026-06-10T15:00:00Z',
    attendees: people.map(p => ({ name: p.name, alias: p.alias, status: 'accepted' as const })),
    isRecurring: true,
  },
];

// ─── Calendar Events ──────────────────────────────────────────────────
export const calendarEvents: CalendarEvent[] = [
  {
    id: 'evt-1', title: 'Daily Standup', alias: '~standup',
    startTime: '2026-06-10T10:00:00Z', endTime: '2026-06-10T10:15:00Z',
    meetLink: 'https://meet.google.com/abc-defg-hij',
    attendees: ['@anna', '@dmytro', '@maxim', '@olena'],
    color: '#4285f4',
  },
  {
    id: 'evt-2', title: 'Design Review', alias: '~design-review',
    startTime: '2026-06-10T11:00:00Z', endTime: '2026-06-10T11:45:00Z',
    meetLink: 'https://meet.google.com/klm-nopq-rst',
    attendees: ['@olena', '@iryna'],
    color: '#34a853',
  },
  {
    id: 'evt-3', title: 'Lunch Break', alias: '~lunch',
    startTime: '2026-06-10T12:00:00Z', endTime: '2026-06-10T13:00:00Z',
    attendees: [],
    color: '#fbbc05',
  },
  {
    id: 'evt-4', title: 'Sprint Planning', alias: '~sprint-planning',
    startTime: '2026-06-10T14:00:00Z', endTime: '2026-06-10T15:00:00Z',
    meetLink: 'https://meet.google.com/uvw-xyza-bcd',
    attendees: people.map(p => p.alias),
    description: 'Review !q2-roadmap and prioritize tasks',
    color: '#4285f4',
  },
  {
    id: 'evt-5', title: 'Code Freeze Deadline', alias: '~code-freeze',
    startTime: '2026-06-12T18:00:00Z', endTime: '2026-06-12T18:00:00Z',
    attendees: [],
    description: 'No merges to main after this point',
    color: '#ea4335',
  },
];

// ─── GitHub Organization ──────────────────────────────────────────────
export const githubOrg: GitHubOrganization = {
  login: 'swagalabs',
  name: 'SwagaLabs',
  alias: '#swagalabs',
  description: 'Building collaborative development tools',
  avatarUrl: '',
  members: people.map(p => ({
    login: p.login,
    alias: p.alias,
    name: p.name,
    avatarUrl: '',
    role: p.login === 'anna.k' ? 'admin' as const : 'member' as const,
  })),
  teams: [
    { slug: 'backend', name: 'Backend', alias: '#team-backend', description: 'API & services', memberCount: 3 },
    { slug: 'frontend', name: 'Frontend', alias: '#team-frontend', description: 'UI & UX', memberCount: 3 },
    { slug: 'devops', name: 'DevOps', alias: '#team-devops', description: 'Infrastructure & CI/CD', memberCount: 2 },
    { slug: 'leads', name: 'Tech Leads', alias: '#team-leads', description: 'Technical leadership', memberCount: 2 },
  ],
};

// ─── GitHub Repos ─────────────────────────────────────────────────────
export const githubRepos: GitHubRepo[] = [
  {
    id: 1, name: 'kasper', alias: '$kasper', fullName: 'swagalabs/kasper',
    description: 'VS Code fork with collaborative integrations',
    language: 'TypeScript', stars: 128, forks: 15, openIssues: 23,
    updatedAt: '2026-06-10T08:00:00Z', isPrivate: false, defaultBranch: 'main',
  },
  {
    id: 2, name: 'kasper-api', alias: '$kasper-api', fullName: 'swagalabs/kasper-api',
    description: 'Backend API for Kasper services',
    language: 'Go', stars: 45, forks: 8, openIssues: 7,
    updatedAt: '2026-06-10T09:15:00Z', isPrivate: false, defaultBranch: 'main',
  },
  {
    id: 3, name: 'kasper-ui', alias: '$kasper-ui', fullName: 'swagalabs/kasper-ui',
    description: 'Shared UI component library for Kasper',
    language: 'TypeScript', stars: 34, forks: 5, openIssues: 4,
    updatedAt: '2026-06-10T09:22:00Z', isPrivate: false, defaultBranch: 'main',
  },
  {
    id: 4, name: 'kasper-infra', alias: '$kasper-infra', fullName: 'swagalabs/kasper-infra',
    description: 'Terraform & Kubernetes configs for Kasper deployment',
    language: 'HCL', stars: 12, forks: 2, openIssues: 1,
    updatedAt: '2026-06-10T09:30:00Z', isPrivate: true, defaultBranch: 'main',
  },
  {
    id: 5, name: 'kasper-docs', alias: '$kasper-docs', fullName: 'swagalabs/kasper-docs',
    description: 'Documentation portal for Kasper',
    language: 'MDX', stars: 18, forks: 10, openIssues: 3,
    updatedAt: '2026-06-09T16:00:00Z', isPrivate: false, defaultBranch: 'main',
  },
];

// ─── GitHub Projects ──────────────────────────────────────────────────
export const githubProjects: GitHubProject[] = [
  {
    id: 1, title: 'Q2 Roadmap', alias: '!q2-roadmap',
    description: 'Q2 2026 product milestones and deliverables',
    url: 'https://github.com/orgs/swagalabs/projects/1',
    columns: [
      {
        id: 1, name: 'Backlog',
        cards: [
          { id: 1, title: 'WebSocket support for live Chat sync', body: 'Real-time message delivery via WS', assignees: ['@dmytro'], labels: [{ name: 'enhancement', color: '0075ca' }], status: 'backlog', linkedRepo: '$kasper-api' },
          { id: 2, title: 'Calendar widget mini-view', body: 'Compact calendar view for sidebar', assignees: ['@olena'], labels: [{ name: 'feature', color: '008672' }], status: 'backlog', linkedRepo: '$kasper-ui' },
        ],
      },
      {
        id: 2, name: 'In Progress',
        cards: [
          { id: 3, title: 'Auth middleware refactor', body: 'Migrate to new OAuth2 flow', assignees: ['@anna', '@maxim'], labels: [{ name: 'security', color: 'e4e669' }, { name: 'priority:high', color: 'd73a4a' }], status: 'in_progress', linkedRepo: '$kasper-api', linkedIssue: 42 },
          { id: 4, title: 'Sidebar navigation redesign', body: 'New navigation with module switching', assignees: ['@olena', '@iryna'], labels: [{ name: 'design', color: 'c5def5' }], status: 'in_progress', linkedRepo: '$kasper-ui' },
          { id: 5, title: 'GitHub Projects integration', body: 'Render project boards inside VS Code', assignees: ['@dmytro'], labels: [{ name: 'feature', color: '008672' }], status: 'in_progress', linkedRepo: '$kasper' },
        ],
      },
      {
        id: 3, name: 'Review',
        cards: [
          { id: 6, title: 'CI pipeline optimization', body: 'Reduce build time from 8min to 3min', assignees: ['@sergiy'], labels: [{ name: 'devops', color: 'fbca04' }], status: 'review', linkedRepo: '$kasper-infra' },
        ],
      },
      {
        id: 4, name: 'Done',
        cards: [
          { id: 7, title: 'Google Chat basic integration', body: 'Read & send messages from VS Code', assignees: ['@anna', '@dmytro'], labels: [{ name: 'feature', color: '008672' }], status: 'done', linkedRepo: '$kasper' },
          { id: 8, title: 'Alias system v1', body: 'Human-readable aliases for cross-module navigation', assignees: ['@anna'], labels: [{ name: 'core', color: '7057ff' }], status: 'done', linkedRepo: '$kasper' },
        ],
      },
    ],
  },
  {
    id: 2, title: 'Auth Migration', alias: '!auth-migration',
    description: 'Track the migration from legacy auth to new OAuth2 flow',
    url: 'https://github.com/orgs/swagalabs/projects/2',
    columns: [
      {
        id: 5, name: 'Todo',
        cards: [
          { id: 9, title: 'Revoke legacy tokens', body: 'Invalidate all v1 tokens after migration', assignees: ['@sergiy'], labels: [{ name: 'security', color: 'e4e669' }], status: 'todo', linkedRepo: '$kasper-api' },
        ],
      },
      {
        id: 6, name: 'In Progress',
        cards: [
          { id: 10, title: 'Implement new token refresh', body: 'Auto-refresh with sliding window', assignees: ['@maxim'], labels: [{ name: 'security', color: 'e4e669' }], status: 'in_progress', linkedRepo: '$kasper-api' },
        ],
      },
      {
        id: 7, name: 'Done',
        cards: [
          { id: 11, title: 'OAuth2 provider setup', body: 'Configure Google & GitHub OAuth apps', assignees: ['@anna'], labels: [{ name: 'security', color: 'e4e669' }], status: 'done', linkedRepo: '$kasper-infra' },
        ],
      },
    ],
  },
];

// ─── Generate all alias entries from mock data ────────────────────────
export function generateAliases(): AliasEntry[] {
  const aliases: AliasEntry[] = [];

  // People
  for (const p of people) {
    aliases.push({
      alias: p.alias, module: 'google-chat', resourceType: 'user',
      resourceId: p.login, displayName: p.name,
    });
  }

  // Chat spaces
  for (const s of chatSpaces) {
    if (s.type === 'ROOM') {
      aliases.push({
        alias: s.alias, module: 'google-chat', resourceType: 'channel',
        resourceId: s.id, displayName: s.name,
      });
    }
  }

  // Meetings
  for (const m of meetings) {
    aliases.push({
      alias: m.alias, module: 'google-meet', resourceType: 'meeting',
      resourceId: m.id, displayName: m.title,
    });
  }

  // Calendar events (those not already covered by meetings)
  for (const e of calendarEvents) {
    if (!aliases.find(a => a.alias === e.alias)) {
      aliases.push({
        alias: e.alias, module: 'google-calendar', resourceType: 'event',
        resourceId: e.id, displayName: e.title,
      });
    }
  }

  // GitHub org
  aliases.push({
    alias: githubOrg.alias, module: 'github-org', resourceType: 'org',
    resourceId: githubOrg.login, displayName: githubOrg.name,
  });

  // Teams
  for (const t of githubOrg.teams) {
    aliases.push({
      alias: t.alias, module: 'github-org', resourceType: 'team',
      resourceId: t.slug, displayName: t.name,
    });
  }

  // Repos
  for (const r of githubRepos) {
    aliases.push({
      alias: r.alias, module: 'github-repos', resourceType: 'repo',
      resourceId: r.fullName, displayName: r.name,
    });
  }

  // Projects
  for (const p of githubProjects) {
    aliases.push({
      alias: p.alias, module: 'github-projects', resourceType: 'project',
      resourceId: String(p.id), displayName: p.title,
    });
  }

  return aliases;
}
