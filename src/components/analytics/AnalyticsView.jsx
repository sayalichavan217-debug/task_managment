import React from 'react';
import { useBoard } from '../../context/BoardContext';
import { PRIORITIES, TEAM_MEMBERS, COLUMNS, getInitials } from '../../constants/data';
import { CheckCircle2, Clock, AlertTriangle, Layers, ArrowLeft } from 'lucide-react';

export const AnalyticsView = () => {
  const { tasks, setActiveView } = useBoard();

  const total = tasks.length;
  const completed = tasks.filter((t) => t.columnId === 'done').length;
  const inProgress = tasks.filter((t) => t.columnId === 'in_progress').length;
  const inReview = tasks.filter((t) => t.columnId === 'in_review').length;
  const todo = tasks.filter((t) => t.columnId === 'todo').length;
  const bugs = tasks.filter((t) => t.issueType === 'bug').length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Breakdown by Priority
  const priorityCounts = {
    urgent: tasks.filter((t) => t.priority === 'urgent').length,
    high: tasks.filter((t) => t.priority === 'high').length,
    medium: tasks.filter((t) => t.priority === 'medium').length,
    low: tasks.filter((t) => t.priority === 'low').length
  };

  return (
    <div className="analytics-dashboard-container">
      {/* Back button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          className="btn-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          onClick={() => setActiveView('board')}
        >
          <ArrowLeft size={14} />
          <span>Back to Task Board</span>
        </button>

        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          Updated in real-time from localStorage
        </span>
      </div>

      {/* Top Stat Metrics */}
      <div className="analytics-stats-grid">
        <div className="stat-metric-card">
          <div className="stat-metric-header">
            <span>Sprint Completion</span>
            <CheckCircle2 size={16} color="#10B981" />
          </div>
          <div className="stat-metric-value">{completionRate}%</div>
          <div className="stat-metric-footer">{completed} of {total} issues done</div>
        </div>

        <div className="stat-metric-card">
          <div className="stat-metric-header">
            <span>Active In Progress</span>
            <Clock size={16} color="#3B82F6" />
          </div>
          <div className="stat-metric-value">{inProgress}</div>
          <div className="stat-metric-footer">{inReview} awaiting review</div>
        </div>

        <div className="stat-metric-card">
          <div className="stat-metric-header">
            <span>Open Bugs & Defects</span>
            <AlertTriangle size={16} color="#EF4444" />
          </div>
          <div className="stat-metric-value">{bugs}</div>
          <div className="stat-metric-footer">
            {tasks.filter((t) => t.issueType === 'bug' && t.columnId !== 'done').length} unresolved
          </div>
        </div>

        <div className="stat-metric-card">
          <div className="stat-metric-header">
            <span>Backlog / To Do</span>
            <Layers size={16} color="#6B7280" />
          </div>
          <div className="stat-metric-value">{todo}</div>
          <div className="stat-metric-footer">Queued for development</div>
        </div>
      </div>

      {/* Charts / Progress Rows */}
      <div className="analytics-charts-grid">
        {/* Status Distribution */}
        <div className="chart-panel-card">
          <h3 className="chart-panel-title">Column Distribution</h3>
          <div className="progress-bar-group">
            {COLUMNS.map((col) => {
              const count = tasks.filter((t) => t.columnId === col.id).length;
              const percent = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={col.id} className="progress-row-item">
                  <div className="progress-label-row">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: col.color
                        }}
                      />
                      {col.title}
                    </span>
                    <span>
                      {count} ({percent}%)
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${percent}%`, backgroundColor: col.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="chart-panel-card">
          <h3 className="chart-panel-title">Priority Distribution</h3>
          <div className="progress-bar-group">
            {Object.keys(PRIORITIES).map((pKey) => {
              const config = PRIORITIES[pKey];
              const count = priorityCounts[pKey];
              const percent = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={pKey} className="progress-row-item">
                  <div className="progress-label-row">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: config.color
                        }}
                      />
                      {config.label}
                    </span>
                    <span>
                      {count} ({percent}%)
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${percent}%`, backgroundColor: config.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team Member Workload */}
      <div className="chart-panel-card">
        <h3 className="chart-panel-title">Team Member Workload</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px'
          }}
        >
          {TEAM_MEMBERS.map((member) => {
            const memberTasks = tasks.filter((t) => t.assigneeId === member.id);
            const memberDone = memberTasks.filter((t) => t.columnId === 'done').length;
            const completion = memberTasks.length > 0 ? Math.round((memberDone / memberTasks.length) * 100) : 0;

            return (
              <div
                key={member.id}
                style={{
                  padding: '12px 14px',
                  backgroundColor: 'var(--bg-surface-secondary)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    className="avatar-circle"
                    style={{ backgroundColor: member.avatarColor }}
                  >
                    {member.initials || getInitials(member.name)}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: 600, fontSize: '13px' }}>{member.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{member.role}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Assigned: {memberTasks.length}</span>
                  <span style={{ color: 'var(--color-story)', fontWeight: 600 }}>{completion}% done</span>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${completion}%`, backgroundColor: member.avatarColor }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
