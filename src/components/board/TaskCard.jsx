import React, { useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import { IssueTypeIcon } from '../common/IssueTypeIcon';
import { PriorityBadge } from '../common/PriorityBadge';
import { COLUMNS, getInitials, formatDate } from '../../constants/data';
import { CheckSquare, MoreHorizontal, Trash2, Edit3, ArrowRight, Calendar, UserX } from 'lucide-react';

export const TaskCard = ({ task }) => {
  const {
    setSelectedTask,
    setDeleteConfirmTask,
    draggingTaskId,
    setDraggingTaskId,
    moveTask,
    getUserById
  } = useBoard();

  const [menuOpen, setMenuOpen] = useState(false);

  const assignee = getUserById(task.assigneeId || task.assignee);
  const isAssigned = !!assignee;

  const isDragging = draggingTaskId === task.id;

  // Subtask progress
  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;

  // Drag handlers
  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
    setDraggingTaskId(task.id);
  };

  const handleDragEnd = () => {
    setDraggingTaskId(null);
  };

  const handleCardClick = (e) => {
    if (e.target.closest('.card-actions-menu') || e.target.closest('.card-quick-menu-dropdown')) {
      return;
    }
    setSelectedTask(task);
  };

  return (
    <div
      className={`task-card ${isDragging ? 'is-dragging' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleCardClick}
      title="Click to view details, drag to move"
    >
      {/* Top Row: Type, Key, Actions */}
      <div className="card-top-row">
        <div className="card-issue-identity">
          <div className="issue-type-icon">
            <IssueTypeIcon type={task.issueType} />
          </div>
          <span className="card-key">{task.id}</span>
        </div>

        <div className="card-actions-menu" style={{ position: 'relative' }}>
          <button
            className="card-menu-btn"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            title="Card options"
          >
            <MoreHorizontal size={14} />
          </button>

          {menuOpen && (
            <div
              className="card-quick-menu-dropdown"
              style={{
                position: 'absolute',
                right: 0,
                top: '24px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                boxShadow: 'var(--shadow-md)',
                zIndex: 20,
                width: '160px',
                padding: '4px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  fontSize: '12px',
                  borderRadius: '4px',
                  color: 'var(--text-primary)',
                  textAlign: 'left',
                  width: '100%'
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = 'var(--bg-surface-secondary)')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                onClick={() => {
                  setMenuOpen(false);
                  setSelectedTask(task);
                }}
              >
                <Edit3 size={13} />
                <span>Edit Details</span>
              </button>

              <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '2px 0' }} />

              {COLUMNS.filter((c) => c.id !== task.columnId).map((col) => (
                <button
                  key={col.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 10px',
                    fontSize: '11px',
                    borderRadius: '4px',
                    color: 'var(--text-secondary)',
                    textAlign: 'left',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = 'var(--bg-surface-secondary)')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                  onClick={() => {
                    setMenuOpen(false);
                    moveTask(task.id, col.id);
                  }}
                >
                  <ArrowRight size={11} />
                  <span>Move to {col.title}</span>
                </button>
              ))}

              <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '2px 0' }} />

              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px',
                  fontSize: '12px',
                  borderRadius: '4px',
                  color: 'var(--color-urgent)',
                  textAlign: 'left',
                  width: '100%'
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)')}
                onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
                onClick={() => {
                  setMenuOpen(false);
                  setDeleteConfirmTask(task);
                }}
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Middle: Title */}
      <h4 className="card-title">{task.title}</h4>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="card-tags-list">
          {task.tags.map((tag, idx) => (
            <span key={idx} className="card-tag-pill">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom Row: Priority, Subtasks, Story Points, Assignee */}
      <div className="card-bottom-row">
        <div className="card-meta-left">
          <PriorityBadge priority={task.priority} />

          {totalSubtasks > 0 && (
            <div
              className={`card-subtasks-stat ${completedSubtasks === totalSubtasks ? 'completed' : ''}`}
              title={`Subtasks: ${completedSubtasks} of ${totalSubtasks} completed`}
            >
              <CheckSquare size={12} />
              <span>
                {completedSubtasks}/{totalSubtasks}
              </span>
            </div>
          )}

          {task.dueDate && (
            <div
              className="card-duedate-stat"
              title={`Due Date: ${formatDate(task.dueDate)}`}
            >
              <Calendar size={11} />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
        </div>

        <div className="card-meta-right">
          {task.storyPoints ? (
            <span className="card-points-badge" title={`Story points: ${task.storyPoints}`}>
              {task.storyPoints}
            </span>
          ) : null}

          {/* Assignee Avatar Badge with Initials & Name Tooltip */}
          {isAssigned ? (
            <div
              className="card-assignee-avatar-wrapper"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              title={`Assigned to ${assignee.name} (${assignee.email})`}
            >
              <div
                className="card-assignee-avatar"
                style={{
                  backgroundColor: assignee.color || '#3B82F6',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '11px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                {getInitials(assignee.name)}
              </div>
              <span
                style={{
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  fontWeight: 500,
                  maxWidth: '75px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {assignee.name.split(' ')[0]}
              </span>
            </div>
          ) : (
            <div
              className="card-assignee-avatar unassigned"
              style={{
                backgroundColor: 'var(--bg-surface-tertiary)',
                color: 'var(--text-tertiary)',
                border: '1px dashed var(--border-medium)',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 600
              }}
              title="Unassigned"
            >
              ?
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

