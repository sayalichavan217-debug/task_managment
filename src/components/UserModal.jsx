import React, { useState } from 'react';
import { useBoard } from '../context/BoardContext';
import { getInitials, USER_COLOR_PALETTE } from '../constants/data';
import { X, UserPlus, Trash2, Users, ShieldAlert, Check, RefreshCw } from 'lucide-react';

export const UserModal = () => {
  const {
    users,
    tasks,
    addUser,
    deleteUser,
    isUserModalOpen,
    setIsUserModalOpen,
    closeUserModal
  } = useBoard();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedColor, setSelectedColor] = useState(USER_COLOR_PALETTE[0]);
  const [formErrors, setFormErrors] = useState({});

  if (!isUserModalOpen) return null;

  // Generate random avatar color from palette
  const handleRandomizeColor = () => {
    const nextRandom = USER_COLOR_PALETTE[Math.floor(Math.random() * USER_COLOR_PALETTE.length)];
    setSelectedColor(nextRandom);
  };

  const validateForm = () => {
    const errors = {};
    if (!name.trim()) {
      errors.name = 'Full name is required';
    }
    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address';
    } else {
      const emailExists = users.some(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (emailExists) {
        errors.email = 'A team member with this email already exists';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const created = addUser({
      name: name.trim(),
      email: email.trim(),
      color: selectedColor
    });

    if (created) {
      setName('');
      setEmail('');
      // Pick next palette color automatically for convenience
      const nextIndex = (users.length + 1) % USER_COLOR_PALETTE.length;
      setSelectedColor(USER_COLOR_PALETTE[nextIndex]);
      setFormErrors({});
    }
  };

  // Count active tasks for a specific user
  const getUserTaskCount = (userId, userName) => {
    return tasks.filter(
      (t) =>
        t.assigneeId === userId ||
        t.assignee === userId ||
        t.assignee === userName ||
        (userId === 'USR-101' && t.assigneeId === 'sarah') ||
        (userId === 'USR-102' && t.assigneeId === 'alex') ||
        (userId === 'USR-103' && t.assigneeId === 'david') ||
        (userId === 'USR-104' && t.assigneeId === 'elena')
    ).length;
  };

  const handleDeleteClick = (user) => {
    const assignedCount = getUserTaskCount(user.id, user.name);
    if (assignedCount > 0) {
      alert(
        `Cannot delete ${user.name}: This member is currently assigned to ${assignedCount} active task(s). Please reassign or delete their tasks first.`
      );
      return;
    }

    if (window.confirm(`Are you sure you want to remove ${user.name} from the workspace?`)) {
      deleteUser(user.id);
    }
  };

  const initialsPreview = getInitials(name || 'New Member');

  return (
    <div
      className="modal-backdrop"
      onClick={closeUserModal}
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
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-modal-title"
        style={{
          maxWidth: '560px',
          width: '100%',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div className="modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--jira-blue-subtle)',
                color: 'var(--jira-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Users size={18} />
            </div>
            <div>
              <h2 id="user-modal-title" className="modal-title" style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Team & Member Management
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {users.length} active member{users.length !== 1 ? 's' : ''} in workspace
              </span>
            </div>
          </div>

          <button
            className="modal-close-btn"
            onClick={closeUserModal}
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
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div
          className="modal-body"
          style={{
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          {/* Section 1: Add New Member Form */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              padding: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <UserPlus size={15} color="var(--jira-blue)" />
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Add New Team Member
              </h3>
            </div>

            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {/* Full Name */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="new-user-name">
                    Full Name <span className="required-star">*</span>
                  </label>
                  <input
                    id="new-user-name"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Sonia Banvari"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (formErrors.name) setFormErrors((p) => ({ ...p, name: '' }));
                    }}
                    autoFocus
                  />
                  {formErrors.name && (
                    <span style={{ fontSize: '11px', color: 'var(--color-urgent)', marginTop: '2px' }}>
                      {formErrors.name}
                    </span>
                  )}
                </div>

                {/* Email Address */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="new-user-email">
                    Email Address <span className="required-star">*</span>
                  </label>
                  <input
                    id="new-user-email"
                    type="email"
                    className="form-input"
                    placeholder="e.g. sonia@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (formErrors.email) setFormErrors((p) => ({ ...p, email: '' }));
                    }}
                  />
                  {formErrors.email && (
                    <span style={{ fontSize: '11px', color: 'var(--color-urgent)', marginTop: '2px' }}>
                      {formErrors.email}
                    </span>
                  )}
                </div>
              </div>

              {/* Avatar Color Picker & Live Preview */}
              <div className="form-group" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label" style={{ margin: 0 }}>
                    Avatar Color
                  </label>
                  <button
                    type="button"
                    onClick={handleRandomizeColor}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--jira-blue)',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <RefreshCw size={11} /> Randomize
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
                  {/* Color Swatches */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    {USER_COLOR_PALETTE.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: c,
                          border: selectedColor === c ? '2px solid var(--text-primary)' : '2px solid transparent',
                          boxShadow: selectedColor === c ? '0 0 0 2px var(--bg-surface)' : 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0,
                          transition: 'transform 0.1s'
                        }}
                        title={c}
                      >
                        {selectedColor === c && <Check size={12} color="#ffffff" strokeWidth={3} />}
                      </button>
                    ))}

                    {/* Custom Native Color Input */}
                    <label
                      style={{
                        position: 'relative',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        display: 'inline-block',
                        border: '1px dashed var(--border-medium)'
                      }}
                      title="Custom color picker"
                    >
                      <input
                        type="color"
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        style={{
                          opacity: 0,
                          width: '100%',
                          height: '100%',
                          cursor: 'pointer'
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundColor: selectedColor,
                          pointerEvents: 'none'
                        }}
                      />
                    </label>
                  </div>

                  {/* Live Avatar Preview */}
                  <div
                    style={{
                      marginLeft: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '4px 10px',
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: selectedColor,
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {initialsPreview}
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      Preview: {initialsPreview}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Add User Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 14px',
                    fontSize: '12px'
                  }}
                >
                  <UserPlus size={14} />
                  <span>Add Member</span>
                </button>
              </div>
            </form>
          </div>

          {/* Section 2: Team Members List */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Existing Members ({users.length})
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                Stored in <code>jira_users</code>
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                maxHeight: '260px',
                overflowY: 'auto',
                paddingRight: '4px'
              }}
            >
              {users.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-tertiary)', fontSize: '13px' }}>
                  No team members added yet.
                </div>
              ) : (
                users.map((user) => {
                  const initials = getInitials(user.name);
                  const taskCount = getUserTaskCount(user.id, user.name);
                  const hasTasks = taskCount > 0;

                  return (
                    <div
                      key={user.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        backgroundColor: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {/* Left: Avatar & Identity */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: user.color || '#3B82F6',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
                          }}
                        >
                          {initials}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                              {user.name}
                            </span>
                            <span
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '10px',
                                color: 'var(--text-tertiary)',
                                backgroundColor: 'var(--bg-surface-secondary)',
                                padding: '1px 6px',
                                borderRadius: '4px'
                              }}
                            >
                              {user.id}
                            </span>
                          </div>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {user.email}
                          </span>
                        </div>
                      </div>

                      {/* Right: Task Count Badge & Delete Button */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 500,
                            padding: '3px 8px',
                            borderRadius: '12px',
                            backgroundColor: hasTasks ? 'var(--jira-blue-subtle)' : 'var(--bg-surface-secondary)',
                            color: hasTasks ? 'var(--jira-blue)' : 'var(--text-tertiary)',
                            border: '1px solid var(--border-subtle)',
                            whiteSpace: 'nowrap'
                          }}
                          title={hasTasks ? `${taskCount} task(s) assigned` : 'No active tasks'}
                        >
                          {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleDeleteClick(user)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '30px',
                            height: '30px',
                            borderRadius: '6px',
                            border: '1px solid transparent',
                            backgroundColor: 'transparent',
                            color: hasTasks ? 'var(--text-disabled)' : 'var(--color-urgent)',
                            cursor: 'pointer',
                            transition: 'all 0.15s'
                          }}
                          onMouseEnter={(e) => {
                            if (!hasTasks) {
                              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.borderColor = 'transparent';
                          }}
                          title={
                            hasTasks
                              ? `Cannot delete: ${user.name} has ${taskCount} active task(s)`
                              : `Remove ${user.name}`
                          }
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer" style={{ padding: '12px 20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-surface-secondary)' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ShieldAlert size={12} />
            Members with assigned tasks cannot be deleted until reassigned.
          </span>
          <button type="button" className="btn-secondary" onClick={closeUserModal} style={{ padding: '6px 14px', fontSize: '12px' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
