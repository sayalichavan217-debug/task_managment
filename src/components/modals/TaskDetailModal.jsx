import React, { useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import { IssueTypeIcon } from '../common/IssueTypeIcon';
import { COLUMNS, getInitials, formatDate } from '../../constants/data';
import { X, Trash2, CheckSquare, Plus, MessageSquare, Send } from 'lucide-react';

const TaskDetailModalContent = ({ task, onClose }) => {
  const {
    updateTask,
    moveTask,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    addComment,
    setDeleteConfirmTask,
    users,
    getUserById
  } = useBoard();

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [newTagInput, setNewTagInput] = useState('');
  const [isEditingDesc, setIsEditingDesc] = useState(false);

  // Handle title change
  const handleTitleBlur = () => {
    if (title.trim() && title.trim() !== task.title) {
      updateTask(task.id, { title: title.trim() });
    }
  };

  // Handle description change
  const handleSaveDescription = () => {
    updateTask(task.id, { description: description.trim() });
    setIsEditingDesc(false);
  };

  // Handle status / column change
  const handleColumnChange = (newColId) => {
    moveTask(task.id, newColId);
  };

  // Handle priority change
  const handlePriorityChange = (newPriority) => {
    updateTask(task.id, { priority: newPriority });
  };

  // Handle issue type change
  const handleTypeChange = (newType) => {
    updateTask(task.id, { issueType: newType });
  };

  // Handle assignee change
  const handleAssigneeChange = (newAssigneeId) => {
    updateTask(task.id, { assigneeId: newAssigneeId === 'unassigned' ? '' : newAssigneeId });
  };

  // Handle story points change
  const handleStoryPointsChange = (points) => {
    updateTask(task.id, { storyPoints: Number(points) });
  };

  // Handle due date change
  const handleDueDateChange = (date) => {
    updateTask(task.id, { dueDate: date });
  };

  // Add tag
  const handleAddTag = (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && newTagInput.trim()) {
      e.preventDefault();
      const currentTags = task.tags || [];
      const tagToAdd = newTagInput.trim();
      if (!currentTags.includes(tagToAdd)) {
        updateTask(task.id, { tags: [...currentTags, tagToAdd] });
      }
      setNewTagInput('');
    }
  };

  // Remove tag
  const handleRemoveTag = (tagToRemove) => {
    const currentTags = task.tags || [];
    updateTask(task.id, {
      tags: currentTags.filter((t) => t !== tagToRemove)
    });
  };

  // Subtask handlers
  const handleAddSubtask = (e) => {
    if (e) e.preventDefault();
    if (newSubtaskTitle.trim()) {
      addSubtask(task.id, newSubtaskTitle.trim());
      setNewSubtaskTitle('');
    }
  };

  const currentUser = users[0] || { name: 'Sarah Connor', color: '#7C3AED' };

  // Comment handler
  const handleAddComment = (e) => {
    if (e) e.preventDefault();
    if (newCommentText.trim()) {
      addComment(task.id, newCommentText.trim(), currentUser.name);
      setNewCommentText('');
    }
  };

  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
  const subtaskProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const currentAssignee = getUserById(task.assigneeId || task.assignee) || {
    name: 'Unassigned',
    color: '#9CA3AF'
  };

  return (
    <div
      className="modal-dialog modal-lg"
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
    >
      {/* Top Header Bar */}
      <div className="modal-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <IssueTypeIcon type={task.issueType} size={18} />
            <select
              value={task.issueType}
              onChange={(e) => handleTypeChange(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                color: 'var(--text-secondary)'
              }}
            >
              <option value="story">Story</option>
              <option value="task">Task</option>
              <option value="bug">Bug</option>
            </select>
          </div>

          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '13px',
              color: 'var(--text-secondary)'
            }}
          >
            {task.id}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className="navbar-icon-btn"
            onClick={() => setDeleteConfirmTask(task)}
            title="Delete issue"
            style={{ color: 'var(--color-urgent)' }}
          >
            <Trash2 size={16} />
          </button>
          <button className="modal-close-btn" onClick={onClose} title="Close (Esc)">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Modal Body Layout: Main Col + Side Col */}
      <div className="modal-body">
        <div className="detail-modal-layout">
          {/* Left Content Area */}
          <div className="detail-main-col">
            {/* Editable Title */}
            <div>
              <input
                type="text"
                className="detail-title-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleBlur}
                placeholder="Issue title..."
              />
            </div>

            {/* Description Section */}
            <div className="form-group">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label className="form-label" style={{ fontSize: '13px' }}>Description</label>
                {!isEditingDesc && (
                  <button
                    style={{ fontSize: '11px', color: 'var(--jira-blue)', fontWeight: 600 }}
                    onClick={() => setIsEditingDesc(true)}
                  >
                    Edit
                  </button>
                )}
              </div>

              {isEditingDesc ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <textarea
                    className="form-textarea"
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add detailed context or criteria..."
                    autoFocus
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-primary" onClick={handleSaveDescription}>
                      Save
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => {
                        setDescription(task.description || '');
                        setIsEditingDesc(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    padding: '10px 12px',
                    backgroundColor: 'var(--bg-surface-secondary)',
                    borderRadius: '6px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    color: description ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    cursor: 'pointer',
                    minHeight: '60px',
                    whiteSpace: 'pre-wrap'
                  }}
                  onClick={() => setIsEditingDesc(true)}
                >
                  {description || 'Click to add a detailed description...'}
                </div>
              )}
            </div>

            {/* Subtasks Section */}
            <div className="subtasks-section">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckSquare size={16} color="var(--jira-blue)" />
                  <label className="form-label" style={{ fontSize: '13px', margin: 0 }}>
                    Subtasks ({completedSubtasks}/{totalSubtasks})
                  </label>
                </div>
                {totalSubtasks > 0 && (
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {subtaskProgress}% done
                  </span>
                )}
              </div>

              {totalSubtasks > 0 && (
                <div className="progress-track" style={{ height: '5px' }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${subtaskProgress}%`,
                      backgroundColor: subtaskProgress === 100 ? 'var(--color-story)' : 'var(--jira-blue)'
                    }}
                  />
                </div>
              )}

              {/* Subtask list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {task.subtasks?.map((sub) => (
                  <div key={sub.id} className="subtask-item">
                    <label className={`subtask-item-label ${sub.completed ? 'done' : ''}`}>
                      <input
                        type="checkbox"
                        checked={sub.completed}
                        onChange={() => toggleSubtask(task.id, sub.id)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span>{sub.title}</span>
                    </label>
                    <button
                      className="modal-close-btn"
                      onClick={() => deleteSubtask(task.id, sub.id)}
                      title="Delete subtask"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Subtask Form */}
              <form
                onSubmit={handleAddSubtask}
                style={{ display: 'flex', gap: '8px', marginTop: '4px' }}
              >
                <input
                  type="text"
                  className="form-input"
                  placeholder="Add a new subtask..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                />
                <button type="submit" className="btn-secondary" style={{ whiteSpace: 'nowrap' }}>
                  <Plus size={14} /> Add
                </button>
              </form>
            </div>

            {/* Comments & Activity Section */}
            <div className="comments-section">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={16} color="var(--jira-blue)" />
                <label className="form-label" style={{ fontSize: '13px', margin: 0 }}>
                  Activity & Discussion ({task.comments?.length || 0})
                </label>
              </div>

              {/* Comment Input */}
              <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px' }}>
                <div
                  className="avatar-circle"
                  style={{ backgroundColor: currentUser.avatarColor, flexShrink: 0 }}
                  title={`${currentUser.name} (${currentUser.initials || getInitials(currentUser.name)})`}
                >
                  {currentUser.initials || getInitials(currentUser.name)}
                </div>
                <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Add a comment to this issue..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '6px 12px' }}>
                    <Send size={14} />
                  </button>
                </div>
              </form>

              {/* Existing comments */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {task.comments?.map((comment) => (
                  <div key={comment.id} className="comment-bubble">
                    <div
                      className="avatar-circle"
                      style={{
                        backgroundColor:
                          users.find((m) => m.name === comment.author || getInitials(m.name) === comment.avatar)?.color || '#7C3AED',
                        width: '26px',
                        height: '26px'
                      }}
                    >
                      {comment.avatar || getInitials(comment.author)}
                    </div>
                    <div className="comment-content">
                      <div className="comment-author-row">
                        <span className="comment-author-name">{comment.author}</span>
                        <span className="comment-time">
                          {formatDate(comment.createdAt)} at{' '}
                          {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="comment-text">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Attributes Sidebar */}
          <div className="detail-side-col">
            {/* Status */}
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={task.columnId}
                onChange={(e) => handleColumnChange(e.target.value)}
              >
                {COLUMNS.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Assignee */}
            <div className="form-group">
              <label className="form-label">Assignee</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  className="avatar-circle"
                  style={{ backgroundColor: currentAssignee.color || currentAssignee.avatarColor || '#9CA3AF' }}
                >
                  {getInitials(currentAssignee.name)}
                </div>
                <select
                  className="form-select"
                  value={task.assigneeId || 'unassigned'}
                  onChange={(e) => handleAssigneeChange(e.target.value)}
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

            {/* Priority */}
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={task.priority}
                onChange={(e) => handlePriorityChange(e.target.value)}
              >
                <option value="urgent">🔥 Urgent</option>
                <option value="high">🔺 High</option>
                <option value="medium">⏸ Medium</option>
                <option value="low">🔻 Low</option>
              </select>
            </div>

            {/* Story Points */}
            <div className="form-group">
              <label className="form-label">Story Points</label>
              <select
                className="form-select"
                value={task.storyPoints || 1}
                onChange={(e) => handleStoryPointsChange(e.target.value)}
              >
                <option value="1">1 pt</option>
                <option value="2">2 pts</option>
                <option value="3">3 pts</option>
                <option value="5">5 pts</option>
                <option value="8">8 pts</option>
              </select>
            </div>

            {/* Due Date */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Due Date</span>
                {task.dueDate && (
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {formatDate(task.dueDate)}
                  </span>
                )}
              </label>
              <input
                type="date"
                className="form-input"
                value={task.dueDate || ''}
                onChange={(e) => handleDueDateChange(e.target.value)}
              />
            </div>

            {/* Tags / Labels */}
            <div className="form-group">
              <label className="form-label">Labels / Tags</label>
              <div className="card-tags-list" style={{ marginBottom: '6px' }}>
                {task.tags?.map((t, idx) => (
                  <span
                    key={idx}
                    className="card-tag-pill"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    {t}
                    <X
                      size={10}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleRemoveTag(t)}
                    />
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Add label..."
                  style={{ fontSize: '11px', padding: '4px 8px' }}
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                />
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '11px' }}
                  onClick={handleAddTag}
                >
                  +
                </button>
              </div>
            </div>

            {/* Timestamps */}
            <div
              style={{
                paddingTop: '10px',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '11px',
                color: 'var(--text-tertiary)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div>
                Created: {formatDate(task.createdAt)}
              </div>
              <div>
                Updated: {formatDate(task.updatedAt)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TaskDetailModal = () => {
  const { selectedTask, setSelectedTask } = useBoard();

  if (!selectedTask) return null;

  return (
    <div className="modal-backdrop" onClick={() => setSelectedTask(null)}>
      <TaskDetailModalContent
        key={selectedTask.id}
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
};
