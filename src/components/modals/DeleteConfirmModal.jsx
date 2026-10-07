import React from 'react';
import { useBoard } from '../../context/BoardContext';
import { AlertTriangle, X } from 'lucide-react';

export const DeleteConfirmModal = () => {
  const { deleteConfirmTask, setDeleteConfirmTask, deleteTask } = useBoard();

  if (!deleteConfirmTask) return null;

  const handleConfirm = () => {
    deleteTask(deleteConfirmTask.id);
  };

  return (
    <div
      className="modal-backdrop"
      onClick={() => setDeleteConfirmTask(null)}
      style={{ zIndex: 150 }}
    >
      <div
        className="modal-dialog"
        style={{ maxWidth: '440px' }}
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-confirm-title"
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="var(--color-urgent)" />
            <h3 id="delete-confirm-title" className="modal-title" style={{ fontSize: '16px' }}>
              Delete Issue?
            </h3>
          </div>
          <button
            className="modal-close-btn"
            onClick={() => setDeleteConfirmTask(null)}
          >
            <X size={16} />
          </button>
        </div>

        <div className="modal-body" style={{ gap: '10px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
            You're about to permanently delete <strong>{deleteConfirmTask.id}</strong>:
          </p>
          <div
            style={{
              padding: '10px 12px',
              backgroundColor: 'var(--bg-surface-secondary)',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              fontSize: '12px',
              color: 'var(--text-secondary)'
            }}
          >
            "{deleteConfirmTask.title}"
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
            This action cannot be undone. All subtasks and comments on this issue will also be removed.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setDeleteConfirmTask(null)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={handleConfirm}
            autoFocus
          >
            Delete Issue
          </button>
        </div>
      </div>
    </div>
  );
};
