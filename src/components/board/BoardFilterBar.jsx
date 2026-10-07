import React from 'react';
import { useBoard } from '../../context/BoardContext';
import { Search, X } from 'lucide-react';
import { TEAM_MEMBERS } from '../../constants/data';

export const BoardFilterBar = () => {
  const {
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter,
    typeFilter,
    setTypeFilter,
    assigneeFilter,
    setAssigneeFilter,
    quickFilter,
    setQuickFilter,
    filteredTasks,
    tasks
  } = useBoard();

  const isAnyFilterActive =
    searchQuery.trim() !== '' ||
    priorityFilter !== 'all' ||
    typeFilter !== 'all' ||
    assigneeFilter !== 'all' ||
    quickFilter !== 'all';

  const handleClearAll = () => {
    setSearchQuery('');
    setPriorityFilter('all');
    setTypeFilter('all');
    setAssigneeFilter('all');
    setQuickFilter('all');
  };

  return (
    <div className="board-filters-container">
      <div className="filter-controls-left">
        {/* Search Input */}
        <div className="filter-input-box">
          <Search size={14} className="filter-input-icon" />
          <input
            type="text"
            className="filter-input"
            placeholder="Filter by title, tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="filter-clear-btn"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Issue Type Dropdown */}
        <select
          className="filter-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          title="Filter by Issue Type"
        >
          <option value="all">Type: All</option>
          <option value="story">Type: Story</option>
          <option value="task">Type: Task</option>
          <option value="bug">Type: Bug</option>
        </select>

        {/* Priority Dropdown */}
        <select
          className="filter-select"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          title="Filter by Priority"
        >
          <option value="all">Priority: All</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* Assignee Dropdown */}
        <select
          className="filter-select"
          value={assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value)}
          title="Filter by Assignee"
        >
          <option value="all">Assignee: All</option>
          {TEAM_MEMBERS.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>

        {/* Quick Filter Buttons */}
        <div className="quick-filter-pills">
          <button
            className={`quick-filter-btn ${quickFilter === 'my_issues' ? 'active' : ''}`}
            onClick={() => setQuickFilter(quickFilter === 'my_issues' ? 'all' : 'my_issues')}
          >
            Only My Issues
          </button>
          <button
            className={`quick-filter-btn ${quickFilter === 'bugs' ? 'active' : ''}`}
            onClick={() => setQuickFilter(quickFilter === 'bugs' ? 'all' : 'bugs')}
          >
            Bugs
          </button>
          <button
            className={`quick-filter-btn ${quickFilter === 'high_priority' ? 'active' : ''}`}
            onClick={() => setQuickFilter(quickFilter === 'high_priority' ? 'all' : 'high_priority')}
          >
            Urgent / High
          </button>
        </div>

        {/* Clear Filters Button */}
        {isAnyFilterActive && (
          <button
            className="btn-clear-all-filters"
            onClick={handleClearAll}
            title="Clear all active filters"
          >
            Clear filters
          </button>
        )}
      </div>

      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
        Showing <strong>{filteredTasks.length}</strong> of {tasks.length} issues
      </div>
    </div>
  );
};
