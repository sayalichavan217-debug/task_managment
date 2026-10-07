import React from 'react';
import { useBoard } from '../../context/BoardContext';
import { Plus, Search, Sun, Moon, Users, Filter, UserCheck } from 'lucide-react';
import { getInitials } from '../../constants/data';

export const Navbar = () => {
  const {
    theme,
    toggleTheme,
    openCreateModal,
    openUserModal,
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter,
    assigneeFilter,
    setAssigneeFilter,
    users,
    tasks
  } = useBoard();

  const currentUser = users[0] || { name: 'Sarah Connor', color: '#7C3AED' };

  // Calculate sprint completion
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.columnId === 'done').length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <header className="jira-navbar">
      <div className="navbar-left">
        <div className="jira-brand" title="Jira Agile Management">
          <div className="jira-logo-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M11.53 2c0 2.4 1.97 4.35 4.4 4.35h1.78v1.74c0 2.4 1.97 4.35 4.4 4.35V2h-10.58zm-5.76 5.8c0 2.4 1.97 4.35 4.4 4.35h1.78v1.74c0 2.4 1.97 4.35 4.4 4.35V7.8H5.77zm-5.77 5.8c0 2.4 1.97 4.35 4.4 4.35h1.78v1.74c0 2.4 1.97 4.35 4.4 4.35v-10.44H0z"/>
            </svg>
          </div>
          <div className="brand-text-container">
            <span className="brand-name">Jira Agile</span>
            <span className="brand-badge">Software</span>
          </div>
        </div>

        <div className="navbar-project-chip" title="Active Project">
          <div className="project-icon-box">PE</div>
          <span>Platform Engineering</span>
        </div>
      </div>

      <div className="navbar-center">
        {/* Search Bar */}
        <div className="navbar-search-wrapper">
          <Search size={15} className="navbar-search-icon" />
          <input
            id="board-search-input"
            type="text"
            className="navbar-search-input"
            placeholder="Search issues, keys, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <kbd className="navbar-search-shortcut" title="Press / to search">/</kbd>
        </div>

        {/* Quick Assignee Filter in Navbar */}
        <div className="navbar-filters-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <select
              className="navbar-filter-select"
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              title="Filter tasks by Assignee"
              style={{
                fontSize: '12px',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: assigneeFilter !== 'all' ? 'var(--jira-blue-tint)' : 'var(--bg-surface)',
                borderColor: assigneeFilter !== 'all' ? 'var(--jira-blue)' : 'var(--border-subtle)',
                color: 'var(--text-primary)',
                fontWeight: assigneeFilter !== 'all' ? 600 : 400,
                cursor: 'pointer'
              }}
            >
              <option value="all">All Assignees</option>
              <option value="unassigned">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Priority Filter in Navbar */}
          <select
            className="navbar-filter-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            title="Filter tasks by Priority"
            style={{
              fontSize: '12px',
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              backgroundColor: priorityFilter !== 'all' ? 'var(--jira-blue-tint)' : 'var(--bg-surface)',
              borderColor: priorityFilter !== 'all' ? 'var(--jira-blue)' : 'var(--border-subtle)',
              color: 'var(--text-primary)',
              fontWeight: priorityFilter !== 'all' ? 600 : 400,
              cursor: 'pointer'
            }}
          >
            <option value="all">All Priorities</option>
            <option value="urgent">🔥 Urgent</option>
            <option value="high">🔺 High</option>
            <option value="medium">⏸ Medium</option>
            <option value="low">🔻 Low</option>
          </select>
        </div>
      </div>

      <div className="navbar-right">
        {/* Manage Team Button */}
        <button
          className="btn-manage-team"
          onClick={openUserModal}
          title="Manage workspace team members"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: 600,
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-secondary)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface)')}
        >
          <Users size={15} color="var(--jira-blue)" />
          <span>Manage Team</span>
          <span
            style={{
              backgroundColor: 'var(--jira-blue-subtle)',
              color: 'var(--jira-blue)',
              fontSize: '10px',
              padding: '1px 5px',
              borderRadius: '10px',
              fontWeight: 700
            }}
          >
            {users.length}
          </span>
        </button>

        {/* Create Issue Button */}
        <button
          className="btn-create-task"
          onClick={() => openCreateModal('todo')}
          title="Create Issue (Shortcut: C)"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Create</span>
          <span className="create-task-key-hint">C</span>
        </button>

        {/* Mini Sprint Progress Meter */}
        <div className="board-stats-pill" title={`${completedTasks} of ${totalTasks} issues completed (${completionPercentage}%)`}>
          <span>Sprint: {completionPercentage}%</span>
          <div className="progress-mini-bar">
            <div
              className="progress-mini-fill"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          className="navbar-icon-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
        </button>

        {/* Current User Avatar with Team Modal Trigger */}
        <div
          className="user-profile-badge"
          onClick={openUserModal}
          style={{ cursor: 'pointer' }}
          title={`Logged in as ${currentUser.name} — Click to manage team`}
        >
          <div
            className="avatar-circle"
            style={{ backgroundColor: currentUser.color || '#7C3AED' }}
          >
            {getInitials(currentUser.name)}
          </div>
        </div>
      </div>
    </header>
  );
};

