import React from 'react';
import { BoardProvider, useBoard } from './context/BoardContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { KanbanBoard } from './components/board/KanbanBoard';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { CreateTaskModal } from './components/modals/CreateTaskModal';
import { TaskDetailModal } from './components/modals/TaskDetailModal';
import { DeleteConfirmModal } from './components/modals/DeleteConfirmModal';
import { ToastContainer } from './components/common/ToastContainer';

const MainLayout = () => {
  const { activeView } = useBoard();

  return (
    <div className="jira-app-container">
      {/* Top Navbar */}
      <Navbar />

      <div className="jira-main-wrapper">
        {/* Collapsible Left Sidebar */}
        <Sidebar />

        {/* Content Area (Board or Analytics) */}
        <main className="jira-content-area">
          {activeView === 'board' ? <KanbanBoard /> : <AnalyticsView />}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <CreateTaskModal />
      <TaskDetailModal />
      <DeleteConfirmModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <BoardProvider>
      <MainLayout />
    </BoardProvider>
  );
}
