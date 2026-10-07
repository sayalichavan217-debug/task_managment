import React from 'react';
import { useBoard } from '../../context/BoardContext';
import { TEAM_MEMBERS } from '../../constants/data';
import {
  Kanban,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Filter,
  UserCheck,
  Flame,
  Bug,
  RotateCcw,
  Layers
} from 'lucide-react';

export const Sidebar = () => {
  const {
    isSidebarCollapsed,
    toggleSidebar,
    activeView,
    setActiveView,
    quickFilter,
    setQuickFilter,
    resetToMockData,
    tasks
  } = useBoard();

  const currentUser = TEAM_MEMBERS.find((m) => m.isCurrentUser) || TEAM_MEMBERS[0];
  const totalTasks = tasks.length;
  const myTasksCount = tasks.filter((t) => t.assigneeId === currentUser?.id).length;
  const bugTasksCount = tasks.filter((t) => t.issueType === 'bug').length;
  const urgentTasksCount = tasks.filter((t) => t.priority === 'urgent' || t.priority === 'high').length;

  return (
    <aside className={`jira-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-project-info">
          <div className="sidebar-project-avatar" title="Platform Engineering">
            <Layers size={18} />
          </div>
          {!isSidebarCollapsed && (
            <div className="sidebar-project-text">
              <span className="sidebar-project-name">Platform Core</span>
              <span className="sidebar-project-type">Software Project</span>
            </div>
          )}
        </div>
        <button
          className="sidebar-toggle-btn"
          onClick={toggleSidebar}
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <div className="sidebar-content">
        {/* Planning Views */}
        <div>
          {!isSidebarCollapsed && <div className="sidebar-section-title">Views</div>}
          <ul className="sidebar-nav-list">
            <li
              className={`sidebar-nav-item ${activeView === 'board' ? 'active' : ''}`}
              onClick={() => setActiveView('board')}
              title="Task Board"
            >
              <Kanban size={17} />
              {!isSidebarCollapsed && (
                <>
                  <span>Task Board</span>
                  <span className="sidebar-badge">{totalTasks}</span>
                </>
              )}
            </li>
            <li
              className={`sidebar-nav-item ${activeView === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveView('analytics')}
              title="Sprint Metrics & Analytics"
            >
              <BarChart3 size={17} />
              {!isSidebarCollapsed && <span>Sprint Insights</span>}
            </li>
          </ul>
        </div>

        {/* Quick Filters */}
        <div>
          {!isSidebarCollapsed && <div className="sidebar-section-title">Quick Filters</div>}
          <ul className="sidebar-nav-list">
            <li
              className={`sidebar-nav-item ${quickFilter === 'all' ? 'active' : ''}`}
              onClick={() => setQuickFilter('all')}
              title="All Issues"
            >
              <Filter size={16} />
              {!isSidebarCollapsed && <span>All Issues</span>}
            </li>
            <li
              className={`sidebar-nav-item ${quickFilter === 'my_issues' ? 'active' : ''}`}
              onClick={() => setQuickFilter('my_issues')}
              title="My Assigned Issues"
            >
              <UserCheck size={16} />
              {!isSidebarCollapsed && (
                <>
                  <span>Only My Issues</span>
                  <span className="sidebar-badge">{myTasksCount}</span>
                </>
              )}
            </li>
            <li
              className={`sidebar-nav-item ${quickFilter === 'bugs' ? 'active' : ''}`}
              onClick={() => setQuickFilter('bugs')}
              title="Bugs and Defects"
            >
              <Bug size={16} />
              {!isSidebarCollapsed && (
                <>
                  <span>Bugs Only</span>
                  <span className="sidebar-badge">{bugTasksCount}</span>
                </>
              )}
            </li>
            <li
              className={`sidebar-nav-item ${quickFilter === 'high_priority' ? 'active' : ''}`}
              onClick={() => setQuickFilter('high_priority')}
              title="Urgent & High Priority"
            >
              <Flame size={16} />
              {!isSidebarCollapsed && (
                <>
                  <span>High & Urgent</span>
                  <span className="sidebar-badge">{urgentTasksCount}</span>
                </>
              )}
            </li>
          </ul>
        </div>
      </div>

      <div className="sidebar-footer">
        <button
          className="sidebar-reset-btn"
          onClick={() => {
            if (window.confirm('Reset board to default Jira sample data? Any unpersisted edits will be refreshed.')) {
              resetToMockData();
            }
          }}
          title="Reset board to default sample data"
        >
          <RotateCcw size={15} />
          {!isSidebarCollapsed && <span>Reset Sample Data</span>}
        </button>
      </div>
    </aside>
  );
};
