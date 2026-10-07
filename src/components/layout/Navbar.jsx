import React from 'react';
import { useBoard } from '../../context/BoardContext';
import { Plus, Search, Sun, Moon, Bell } from 'lucide-react';
import { TEAM_MEMBERS, getInitials } from '../../constants/data';

export const Navbar = () => {
  const {
    theme,
    toggleTheme,
    openCreateModal,
    searchQuery,
    setSearchQuery,
    tasks
  } = useBoard();

  const currentUser = TEAM_MEMBERS.find((m) => m.isCurrentUser) || TEAM_MEMBERS[0];

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
      </div>

      <div className="navbar-right">
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

        {/* Notifications mock */}
        <button className="navbar-icon-btn" title="Recent activity & notifications">
          <Bell size={17} />
        </button>

        {/* User Avatar */}
        <div className="user-profile-badge" title={`${currentUser.name} (${currentUser.role})`}>
          <div
            className="avatar-circle"
            style={{ backgroundColor: currentUser.avatarColor }}
          >
            {currentUser.initials || getInitials(currentUser.name)}
          </div>
        </div>
      </div>
    </header>
  );
};
