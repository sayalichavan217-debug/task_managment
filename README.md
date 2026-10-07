# Jira Agile Task Management Web Application

A full-featured, responsive Jira-like Task Management web application built with **React.js**, **Vanilla CSS design system**, and **HTML5 Drag-and-Drop API**.

![Jira Agile Task Management](https://img.shields.io/badge/React-19-blue.svg)
![Status](https://img.shields.io/badge/Status-Completed-success.svg)

---

## 🚀 Key Features

### 1. Kanban Board & Drag-and-Drop
- **4 Standard Columns**: `TO DO`, `IN PROGRESS`, `IN REVIEW`, and `DONE`
- **Native HTML5 Drag & Drop**:
  - Drag tasks smoothly between columns and reorder tasks within columns.
  - Glowing drop-target affordances, reduced drag-card opacity, and rotation preview.
  - Celebratory **confetti burst** when any task is moved to `DONE`!

### 2. Task CRUD Operations
- **Create Issue**:
  - Modal with Issue Type (`Story` 🟢, `Task` 🔵, `Bug` 🔴), Summary, Description, Priority (`Urgent`, `High`, `Medium`, `Low`), Assignee, Labels/Tags, Story Points, Due Date, and target Column.
  - Shortcut `C` or top navigation "+ Create" button.
  - Keyboard submission with `Ctrl+Enter`.
- **Edit Issue Details (Slide-over / Modal)**:
  - Click any card to open the issue details.
  - In-place editable Title, editable Description with preview.
  - Interactive **Subtasks checklist** with progress meter (`% completed`), checkbox toggling, and adding new subtasks.
  - **Activity & Discussion stream**: Post comments with timestamps and author avatars.
  - Right sidebar for instant status, assignee, priority, story points, and label modification.
- **Delete Issue**:
  - Safe confirmation modal (`DeleteConfirmModal`) before removal.

### 3. Real-Time Search & Filtering
- **Search bar**: Instant query across Issue Key (e.g. `KAN-101`), Title, Description, and Tags (press `/` to focus).
- **Filter Dropdowns**: Filter by Issue Type, Priority, and Team Assignee.
- **Quick Filters**: One-click filters for `"Only My Issues"`, `"Bugs"`, and `"Urgent / High"`.
- **Active filter counter** and "Clear filters" action.

### 4. UI/UX & Jira Aesthetics
- **Atlassian Design System tokens**: Authentic colors, border radii, card elevation shadows, and typography (`Inter` & `Plus Jakarta Sans`).
- **Collapsible Sidebar**: Compact view or expanded navigation with project details.
- **Theme Switcher**: Dark Mode and Light Mode with persisted user preference.
- **Sprint Insights / Analytics Tab**: Visual completion percentage, column distribution progress bars, priority distribution, and team workload breakdown.
- **Toast Notifications**: Non-intrusive feedback toasts for task creations, updates, moves, and deletions.

### 5. Local Storage Persistence & Mock Data
- Fully client-side with automatic persistence in `localStorage`.
- Pre-populated on first visit with 8+ realistic Jira engineering issues.
- "Reset Sample Data" button in the sidebar to restore default mock data anytime.

---

## 🛠️ Project Structure

```
g:/project/task_managment/
├── index.html                   # HTML template with Google Fonts & favicon
├── package.json                 # Project configuration
├── src/
│   ├── main.jsx                 # React root entry
│   ├── App.jsx                  # Main application layout
│   ├── index.css                # Jira design system CSS tokens & styles
│   ├── constants/
│   │   └── data.js              # Initial mock data, columns, team members
│   ├── context/
│   │   └── BoardContext.jsx     # State management, CRUD, localStorage, drag & drop
│   ├── components/
│   │   ├── common/
│   │   │   ├── IssueTypeIcon.jsx
│   │   │   ├── PriorityBadge.jsx
│   │   │   └── ToastContainer.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── board/
│   │   │   ├── KanbanBoard.jsx
│   │   │   ├── KanbanColumn.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   └── BoardFilterBar.jsx
│   │   ├── analytics/
│   │   │   └── AnalyticsView.jsx
│   │   └── modals/
│   │       ├── CreateTaskModal.jsx
│   │       ├── TaskDetailModal.jsx
│   │       └── DeleteConfirmModal.jsx
```

---

## 💻 Running Locally

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Build for production
npm run build
```
Open [http://localhost:5173](http://localhost:5173) in your web browser.
