import React from 'react';
import { useBoard } from '../../context/BoardContext';
import { KanbanColumn } from './KanbanColumn';
import { BoardFilterBar } from './BoardFilterBar';
import { Kanban, BarChart2 } from 'lucide-react';

export const KanbanBoard = () => {
  const { columns, activeView, setActiveView } = useBoard();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Board Header */}
      <div className="board-header">
        <div className="board-breadcrumb-row">
          <div className="board-breadcrumbs">
            <span>Projects</span>
            <span className="breadcrumb-separator">/</span>
            <span>Platform Core</span>
            <span className="breadcrumb-separator">/</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Task Board</span>
          </div>
        </div>

        <div className="board-title-row">
          <div className="board-title-group">
            <h1 className="board-main-title">Task Board</h1>
            <span className="sprint-badge">Active Sprint</span>
          </div>

          <div className="board-view-switchers">
            <button
              className={`view-switcher-tab ${activeView === 'board' ? 'active' : ''}`}
              onClick={() => setActiveView('board')}
            >
              <Kanban size={14} />
              <span>Board</span>
            </button>
            <button
              className={`view-switcher-tab ${activeView === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveView('analytics')}
            >
              <BarChart2 size={14} />
              <span>Insights</span>
            </button>
          </div>
        </div>

        {/* Real-time search and filter controls */}
        <BoardFilterBar />
      </div>

      {/* Board Content Area */}
      <div className="kanban-board-wrapper">
        <div className="kanban-columns-container">
          {columns.map((column) => (
            <KanbanColumn key={column.id} column={column} />
          ))}
        </div>
      </div>
    </div>
  );
};
