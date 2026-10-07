export const ISSUE_TYPES = {
  story: {
    id: 'story',
    label: 'Story',
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.12)',
    icon: 'Bookmark',
    description: 'Functionality or user story to deliver value'
  },
  task: {
    id: 'task',
    label: 'Task',
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.12)',
    icon: 'CheckSquare',
    description: 'A discrete piece of work or chore'
  },
  bug: {
    id: 'bug',
    label: 'Bug',
    color: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.12)',
    icon: 'AlertCircle',
    description: 'An unexpected problem or defect'
  }
};

export const PRIORITIES = {
  urgent: {
    id: 'urgent',
    label: 'Urgent',
    rank: 4,
    color: '#DC2626',
    bgColor: 'rgba(220, 38, 38, 0.12)',
    borderColor: 'rgba(220, 38, 38, 0.3)',
    icon: 'ChevronsUp'
  },
  high: {
    id: 'high',
    label: 'High',
    rank: 3,
    color: '#F97316',
    bgColor: 'rgba(249, 115, 22, 0.12)',
    borderColor: 'rgba(249, 115, 22, 0.3)',
    icon: 'ChevronUp'
  },
  medium: {
    id: 'medium',
    label: 'Medium',
    rank: 2,
    color: '#EAB308',
    bgColor: 'rgba(234, 179, 8, 0.12)',
    borderColor: 'rgba(234, 179, 8, 0.3)',
    icon: 'Equal'
  },
  low: {
    id: 'low',
    label: 'Low',
    rank: 1,
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    icon: 'ChevronDown'
  }
};

export const COLUMNS = [
  {
    id: 'todo',
    title: 'TO DO',
    color: '#6B7280',
    headerBg: 'rgba(107, 114, 128, 0.08)',
    wipLimit: 8
  },
  {
    id: 'in_progress',
    title: 'IN PROGRESS',
    color: '#3B82F6',
    headerBg: 'rgba(59, 130, 246, 0.08)',
    wipLimit: 5
  },
  {
    id: 'in_review',
    title: 'IN REVIEW',
    color: '#8B5CF6',
    headerBg: 'rgba(139, 92, 246, 0.08)',
    wipLimit: 5
  },
  {
    id: 'done',
    title: 'DONE',
    color: '#10B981',
    headerBg: 'rgba(16, 185, 129, 0.08)',
    wipLimit: 20
  }
];

export const DEFAULT_USERS = [
  {
    id: 'USR-101',
    name: 'Sarah Connor',
    email: 'sarah.c@jira.internal',
    color: '#7C3AED'
  },
  {
    id: 'USR-102',
    name: 'Alex Morgan',
    email: 'alex.m@jira.internal',
    color: '#2563EB'
  },
  {
    id: 'USR-103',
    name: 'David Kim',
    email: 'david.k@jira.internal',
    color: '#059669'
  },
  {
    id: 'USR-104',
    name: 'Elena Banvari',
    email: 'elena.b@jira.internal',
    color: '#DC2626'
  }
];

export const USER_COLOR_PALETTE = [
  '#3B82F6', // Blue
  '#7C3AED', // Purple
  '#059669', // Emerald
  '#DC2626', // Red
  '#D97706', // Amber
  '#0891B2', // Cyan
  '#DB2777', // Pink
  '#4F46E5', // Indigo
  '#16A34A', // Green
  '#9333EA'  // Fuchsia
];

export const getInitials = (name, fallback = '?') => {
  if (!name) return fallback;
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const formatDate = (dateInput) => {
  if (!dateInput) return '';
  if (typeof dateInput === 'string') {
    const trimmed = dateInput.trim();
    const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const [, year, month, day] = match;
      return `${day}-${month}-${year}`;
    }
  }
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

export const TEAM_MEMBERS = DEFAULT_USERS.map((u) => ({
  ...u,
  role: 'Engineer',
  avatarColor: u.color,
  initials: getInitials(u.name)
}));

export const CURRENT_USER = DEFAULT_USERS[0];

export const INITIAL_TASKS = [
  {
    id: 'KAN-101',
    title: 'Implement OAuth2 PKCE token refresh rotation',
    description: 'Ensure token rotation works seamlessly without forcing users to re-authenticate when the access token expires. Add secure cookie storage and retry middleware.',
    columnId: 'todo',
    issueType: 'story',
    priority: 'high',
    assigneeId: 'USR-101',
    tags: ['Security', 'Auth', 'Backend'],
    storyPoints: 5,
    dueDate: '2026-10-15',
    subtasks: [
      { id: 'sub-1', title: 'Add refresh token endpoint handling', completed: true },
      { id: 'sub-2', title: 'Implement sliding session expiration', completed: false },
      { id: 'sub-3', title: 'Write automated unit tests for race conditions', completed: false }
    ],
    comments: [
      {
        id: 'c-1',
        author: 'Sarah Connor',
        avatar: 'SC',
        text: 'Please ensure this matches the compliance requirements for SOC2 type II.',
        createdAt: '2026-10-04T10:30:00.000Z'
      }
    ],
    createdAt: '2026-10-01T09:00:00.000Z',
    updatedAt: '2026-10-04T10:30:00.000Z'
  },
  {
    id: 'KAN-104',
    title: 'Design interactive drag-and-drop Kanban workflow',
    description: 'Build native drag-and-drop feedback with drop indicators, smooth card elevation, responsive columns, and real-time state persistence in localStorage.',
    columnId: 'in_progress',
    issueType: 'story',
    priority: 'high',
    assigneeId: 'USR-102',
    tags: ['Frontend', 'Kanban', 'UX'],
    storyPoints: 8,
    dueDate: '2026-10-09',
    subtasks: [
      { id: 'sub-9', title: 'Implement HTML5 drag events handlers', completed: true },
      { id: 'sub-10', title: 'Style drag preview ghost and column highlight states', completed: true },
      { id: 'sub-11', title: 'Add audio or confetti celebration upon task completion', completed: true }
    ],
    comments: [
      {
        id: 'c-3',
        author: 'Alex Morgan',
        avatar: 'AM',
        text: 'Native HTML5 drag & drop is buttery smooth and zero external runtime dependencies!',
        createdAt: '2026-10-05T16:00:00.000Z'
      }
    ],
    createdAt: '2026-10-03T10:00:00.000Z',
    updatedAt: '2026-10-05T16:00:00.000Z'
  },
  {
    id: 'KAN-105',
    title: 'Audit Docker container image for CVE vulnerabilities',
    description: 'Scan production base images using Trivy and Grype. Upgrade alpine base packages and eliminate root user permissions in Dockerfile.',
    columnId: 'in_review',
    issueType: 'task',
    priority: 'high',
    assigneeId: 'USR-104',
    tags: ['DevOps', 'Security', 'Docker'],
    storyPoints: 3,
    dueDate: '2026-10-07',
    subtasks: [
      { id: 'sub-12', title: 'Run Trivy scan against latest release tag', completed: true },
      { id: 'sub-13', title: 'Update node:22-alpine base image to latest patch', completed: true },
      { id: 'sub-14', title: 'Verify non-root user execution in staging pod', completed: true }
    ],
    comments: [
      {
        id: 'c-4',
        author: 'Elena Banvari',
        avatar: 'EB',
        text: 'All 4 critical CVEs resolved. Ready for final peer sign-off.',
        createdAt: '2026-10-06T09:30:00.000Z'
      }
    ],
    createdAt: '2026-10-03T14:10:00.000Z',
    updatedAt: '2026-10-06T09:30:00.000Z'
  },
  {
    id: 'KAN-108',
    title: 'Implement Dark Mode design tokens and contrast checks',
    description: 'Verify all Jira theme colors meet WCAG AA contrast ratio of 4.5:1. Provide seamless theme switching with zero flash of unstyled content.',
    columnId: 'done',
    issueType: 'story',
    priority: 'medium',
    assigneeId: 'USR-103',
    tags: ['UI/UX', 'Accessibility', 'Theme'],
    storyPoints: 3,
    dueDate: '2026-10-06',
    subtasks: [
      { id: 'sub-19', title: 'Define CSS variables for slate and surface hues', completed: true },
      { id: 'sub-20', title: 'Contrast check all text and badge combinations', completed: true }
    ],
    comments: [],
    createdAt: '2026-10-01T12:00:00.000Z',
    updatedAt: '2026-10-06T12:30:00.000Z'
  }
];
