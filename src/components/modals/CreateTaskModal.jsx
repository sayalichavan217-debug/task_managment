import React, { useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import { COLUMNS, formatDate } from '../../constants/data';
import { X } from 'lucide-react';

const CreateTaskModalForm = ({ defaultColumn, onClose }) => {
  const { createTask, users } = useBoard();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [columnId, setColumnId] = useState(defaultColumn || 'todo');
  const [issueType, setIssueType] = useState('task');
  const [priority, setPriority] = useState('medium');
  const [assigneeId, setAssigneeId] = useState(users[0]?.id || 'unassigned');
  const [tagsInput, setTagsInput] = useState('');
  const [storyPoints, setStoryPoints] = useState('3');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState({});

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
      tags,
      storyPoints: Number(storyPoints) || 1,
      dueDate
    });

    onClose();
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div
      className="modal-dialog"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-modal-title"
    >
      <div className="modal-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h2 id="create-modal-title" className="modal-title">Create Issue</h2>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>(Press Ctrl+Enter to save)</span>
        </div>
        <button className="modal-close-btn" onClick={onClose} title="Close modal (Esc)">
          <X size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <div className="modal-body">
          {/* Issue Type & Target Column */}
          <div className="form-grid-2">
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

          {/* Priority & Assignee */}
          <div className="form-grid-2">
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

            <div className="form-group">
              <label className="form-label">Assignee</label>
              <select
                className="form-select"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
              >
                <option value="unassigned">Unassigned</option>
                {users.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags & Story Points */}
          <div className="form-grid-2">
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

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Create Issue
          </button>
        </div>
      </form>
    </div>
  );
};

export const CreateTaskModal = () => {
  const { isCreateModalOpen, setIsCreateModalOpen, createModalDefaultColumn } = useBoard();

  if (!isCreateModalOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => setIsCreateModalOpen(false)}>
      <CreateTaskModalForm
        key={String(isCreateModalOpen) + (createModalDefaultColumn || 'todo')}
        defaultColumn={createModalDefaultColumn}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

