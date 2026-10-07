import React, { useState } from 'react';
import { useBoard } from '../context/BoardContext';
import { COLUMNS, formatDate, getInitials } from '../constants/data';
import { X, CheckSquare, Sparkles } from 'lucide-react';

export const TaskModal = ({ isOpen, onClose, defaultColumn = 'todo' }) => {
  const {
    createTask,
    users,
    isCreateModalOpen,
    setIsCreateModalOpen,
    createModalDefaultColumn
  } = useBoard();

  // Support both controlled props and context state
  const isModalOpen = isOpen !== undefined ? isOpen : isCreateModalOpen;
  const handleClose = onClose || (() => setIsCreateModalOpen(false));
  const activeCol = defaultColumn || createModalDefaultColumn || 'todo';

  const defaultAssignee = users[0]?.id || 'unassigned';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [columnId, setColumnId] = useState(activeCol);
  const [issueType, setIssueType] = useState('task');
  const [priority, setPriority] = useState('medium');
  const [assigneeId, setAssigneeId] = useState(defaultAssignee);
  const [tagsInput, setTagsInput] = useState('');
  const [storyPoints, setStoryPoints] = useState('3');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState({});

  if (!isModalOpen) return null;

  const selectedUser = users.find((u) => u.id === assigneeId);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    if (!title.trim()) {
      setErrors({ title: 'Issue summary / title is required' });
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    createTask({
      title: title.trim(),
      description: description.trim(),
      columnId,
      issueType,
      priority,
      assigneeId: assigneeId === 'unassigned' ? '' : assigneeId,
      assignee: selectedUser ? selectedUser.name : 'Unassigned',
      tags,
      storyPoints: Number(storyPoints) || 1,
      dueDate
    });

    handleClose();
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={handleClose}
      role="presentation"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(9, 30, 66, 0.54)',
        backdropFilter: 'blur(3px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        style={{
          maxWidth: '640px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden'
        }}
      >
        <div className="modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 id="task-modal-title" className="modal-title" style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Create Issue
            </h2>
            <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>(Press Ctrl+Enter to save)</span>
          </div>
          <button
            className="modal-close-btn"
            onClick={handleClose}
            title="Close modal (Esc)"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-tertiary)',
              padding: '6px',
              borderRadius: '6px'
            }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className="modal-body" style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Issue Type & Target Column */}
            <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">
                  Issue Type <span className="required-star">*</span>
                </label>
                <select
                  className="form-select"
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                >
                  <option value="story">🟢 Story (Feature)</option>
                  <option value="task">🔵 Task (Chore)</option>
                  <option value="bug">🔴 Bug (Defect)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Status / Column <span className="required-star">*</span>
                </label>
                <select
                  className="form-select"
                  value={columnId}
                  onChange={(e) => setColumnId(e.target.value)}
                >
                  {COLUMNS.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Summary / Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-title-input">
                Summary / Title <span className="required-star">*</span>
              </label>
              <input
                id="task-title-input"
                type="text"
                className="form-input"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors({});
                }}
                autoFocus
              />
              {errors.title && (
                <span style={{ fontSize: '11px', color: 'var(--color-urgent)', marginTop: '2px' }}>
                  {errors.title}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-desc-input">Description</label>
              <textarea
                id="task-desc-input"
                className="form-textarea"
                placeholder="Add context, acceptance criteria, steps to reproduce..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Priority & Dynamic Assignee Select */}
            <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="urgent">🔥 Urgent</option>
                  <option value="high">🔺 High</option>
                  <option value="medium">⏸ Medium</option>
                  <option value="low">🔻 Low</option>
                </select>
              </div>

              {/* Dynamic Assignee Dropdown */}
              <div className="form-group">
                <label className="form-label" htmlFor="task-assignee-select">
                  Assignee
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {selectedUser ? (
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: selectedUser.color || '#3B82F6',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                      title={selectedUser.name}
                    >
                      {getInitials(selectedUser.name)}
                    </div>
                  ) : (
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: '#9CA3AF',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                      title="Unassigned"
                    >
                      ?
                    </div>
                  )}

                  <select
                    id="task-assignee-select"
                    className="form-select"
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                  >
                    <option value="unassigned">Unassigned</option>
                    {users.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name} ({member.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Tags & Story Points */}
            <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Labels / Tags</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Frontend, Auth, UI (comma-separated)"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Story Points</label>
                <select
                  className="form-select"
                  value={storyPoints}
                  onChange={(e) => setStoryPoints(e.target.value)}
                >
                  <option value="1">1 pt (Very small)</option>
                  <option value="2">2 pts (Small)</option>
                  <option value="3">3 pts (Medium)</option>
                  <option value="5">5 pts (Large)</option>
                  <option value="8">8 pts (Complex)</option>
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div className="form-group">
              <label className="form-label" htmlFor="task-due-date" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Due Date</span>
                {dueDate && (
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    ({formatDate(dueDate)})
                  </span>
                )}
              </label>
              <input
                id="task-due-date"
                type="date"
                className="form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer" style={{ padding: '14px 20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', backgroundColor: 'var(--bg-surface-secondary)' }}>
            <button type="button" className="btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Create Issue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
