import * as vscode from 'vscode';

// ─── Module identifiers ───────────────────────────────────────────────
export type KasperModule =
  | 'google-chat'
  | 'google-meet'
  | 'google-calendar'
  | 'github-org'
  | 'github-repos'
  | 'github-projects';

// ─── Alias system ─────────────────────────────────────────────────────
export interface AliasEntry {
  alias: string;           // Human-readable alias, e.g. "@anna", "#backend", "standup"
  module: KasperModule;    // Which module this alias belongs to
  resourceType: string;    // e.g. "user", "channel", "repo", "meeting", "event", "project"
  resourceId: string;      // Real ID or URL
  displayName: string;     // How it renders in UI
  metadata?: Record<string, string>;
}

// ─── Navigation ───────────────────────────────────────────────────────
export interface NavigationTarget {
  module: KasperModule;
  resourceType?: string;
  resourceId?: string;
  alias?: string;
}

export interface NavigationEvent {
  from: KasperModule;
  to: NavigationTarget;
  timestamp: number;
}

// ─── Google Chat ──────────────────────────────────────────────────────
export interface ChatSpace {
  id: string;
  name: string;
  alias: string;
  type: 'ROOM' | 'DM' | 'GROUP';
  memberCount?: number;
}

export interface ChatMessage {
  id: string;
  spaceId: string;
  sender: string;
  senderAlias: string;
  text: string;
  timestamp: string;
  threadId?: string;
  attachments?: { name: string; url: string }[];
}

// ─── Google Meet ──────────────────────────────────────────────────────
export interface Meeting {
  id: string;
  title: string;
  alias: string;
  meetLink: string;
  startTime: string;
  endTime: string;
  attendees: { name: string; alias: string; status: 'accepted' | 'declined' | 'tentative' }[];
  isRecurring: boolean;
}

// ─── Google Calendar ──────────────────────────────────────────────────
export interface CalendarEvent {
  id: string;
  title: string;
  alias: string;
  startTime: string;
  endTime: string;
  location?: string;
  meetLink?: string;
  attendees: string[];
  description?: string;
  color?: string;
}

// ─── GitHub ───────────────────────────────────────────────────────────
export interface GitHubOrganization {
  login: string;
  name: string;
  alias: string;
  description: string;
  avatarUrl: string;
  members: GitHubMember[];
  teams: GitHubTeam[];
}

export interface GitHubMember {
  login: string;
  alias: string;
  name: string;
  avatarUrl: string;
  role: 'admin' | 'member';
}

export interface GitHubTeam {
  slug: string;
  name: string;
  alias: string;
  description: string;
  memberCount: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  alias: string;
  fullName: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  openIssues: number;
  updatedAt: string;
  isPrivate: boolean;
  defaultBranch: string;
}

export interface GitHubProject {
  id: number;
  title: string;
  alias: string;
  description: string;
  columns: GitHubProjectColumn[];
  url: string;
}

export interface GitHubProjectColumn {
  id: number;
  name: string;
  cards: GitHubProjectCard[];
}

export interface GitHubProjectCard {
  id: number;
  title: string;
  body: string;
  assignees: string[];
  labels: { name: string; color: string }[];
  status: string;
  linkedRepo?: string;
  linkedIssue?: number;
}

// ─── Provider interface ───────────────────────────────────────────────
export interface KasperWebviewProvider extends vscode.WebviewViewProvider {
  readonly moduleId: KasperModule;
  refresh(): void;
  navigateTo(resourceType?: string, resourceId?: string): void;
}
