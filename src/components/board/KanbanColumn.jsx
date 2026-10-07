import React, { useState } from 'react';
import { useBoard } from '../../context/BoardContext';
import { TaskCard } from './TaskCard';
import { Plus, Inbox } from 'lucide-react';

export const KanbanColumn = ({ column }) => {
  const {
    filteredTasks,
    moveTask,
    openCreateModal,
    draggingTaskId
  } = useBoard();

  const [isDragOver, setIsDragOver] = useState(false);

  // Get tasks belonging to this column from filtered list (limited to 1 task card per column)
  const columnTasks = filteredTasks.filter((t) => t.columnId === column.id).slice(0, 1);

  // Drag handlers for the column container
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    // Only set to false if we are actually leaving the column element
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const taskId = e.dataTransfer.getData('text/plain') || draggingTaskId;
    if (taskId) {
      moveTask(taskId, column.id);
    }
  };

  return (
    <div
      className={`kanban-column ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="column-header">
        <div className="column-title-box">
          <span
            className="column-status-indicator"
            style={{ backgroundColor: column.color }}
          />
          <span className="column-title">{column.title}</span>
          <span className="column-counter-pill">{columnTasks.length}</span>
        </div>

        <button
          className="column-quick-add-btn"
          onClick={() => openCreateModal(column.id)}
          title={`Create issue in ${column.title}`}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Task Card List */}
      <div className="column-card-list">
        {columnTasks.length > 0 ? (
          columnTasks.map((task, index) => (
            <TaskCard key={task.id} task={task} index={index} />
          ))
        ) : (
          <div className="column-empty-state">
            <Inbox size={22} strokeWidth={1.5} />
            <span>No issues in {column.title}</span>
            <button
              style={{
                marginTop: '4px',
                fontSize: '11px',
                color: 'var(--jira-blue)',
                fontWeight: 600
              }}
              onClick={() => openCreateModal(column.id)}
            >
              + Create an issue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
