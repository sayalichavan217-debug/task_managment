import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { COLUMNS, INITIAL_TASKS, TEAM_MEMBERS, getInitials } from '../constants/data';

const STORAGE_KEY_TASKS = 'jira_kanban_tasks_v3';
const STORAGE_KEY_COLUMNS = 'jira_kanban_columns_v3';
const STORAGE_KEY_THEME = 'jira_kanban_theme_v2';
const STORAGE_KEY_SIDEBAR = 'jira_kanban_sidebar_v2';

const BoardContext = createContext(null);

export const BoardProvider = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      return saved || 'light';
    } catch {
      return 'light';
    }
  });

  // Sidebar collapsed state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_SIDEBAR) === 'true';
    } catch {
      return false;
    }
  });

  // Columns state
  const [columns, setColumns] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COLUMNS);
      return saved ? JSON.parse(saved) : COLUMNS;
    } catch {
      return COLUMNS;
    }
  });

  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASKS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((t) => ({
          ...t,
          comments: t.comments?.map((c) =>
            c.avatar === 'AM'
              ? {
                  ...c,
                  avatar: 'SC',
                  author: c.author === 'Alex Morgan' ? 'Sarah Connor' : c.author
                }
              : c
          )
        }));
      }
      return INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [quickFilter, setQuickFilter] = useState('all');

  // View state: 'board' | 'analytics'
  const [activeView, setActiveView] = useState('board');

  // Selected task id (derived reactivity)
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalDefaultColumn, setCreateModalDefaultColumn] = useState('todo');
  const [deleteConfirmTask, setDeleteConfirmTask] = useState(null);

  // Dragging state
  const [draggingTaskId, setDraggingTaskId] = useState(null);
  const [dragOverColumnId, setDragOverColumnId] = useState(null);
  const [dragOverTargetIndex, setDragOverTargetIndex] = useState(null);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((title, message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Sync theme to root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch (err) {
      console.warn(err);
    }
  }, [theme]);

  // Sync sidebar to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SIDEBAR, String(isSidebarCollapsed));
    } catch (err) {
      console.warn(err);
    }
  }, [isSidebarCollapsed]);

  // Sync columns to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COLUMNS, JSON.stringify(columns));
    } catch (err) {
      console.warn(err);
    }
  }, [columns]);

  // Sync tasks to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch (err) {
      console.warn(err);
    }
  }, [tasks]);

  // Derived selected task object
  const selectedTask = useMemo(() => {
    if (!selectedTaskId) return null;
    return tasks.find((t) => t.id === selectedTaskId) || null;
  }, [tasks, selectedTaskId]);

  const setSelectedTask = useCallback((taskOrNull) => {
    if (!taskOrNull) {
      setSelectedTaskId(null);
    } else if (typeof taskOrNull === 'object') {
      setSelectedTaskId(taskOrNull.id);
    } else {
      setSelectedTaskId(taskOrNull);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, []);

  // Generate unique Jira Issue Key
  const generateNextIssueKey = useCallback(() => {
    const existingNumbers = tasks
      .map((t) => {
        const match = t.id.match(/^KAN-(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((n) => !isNaN(n));
    const maxNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 100;
    return `KAN-${maxNum + 1}`;
  }, [tasks]);

  // CRUD Operations
  const createTask = useCallback((taskData) => {
    const nextKey = generateNextIssueKey();
    const newTask = {
      id: nextKey,
      title: taskData.title.trim(),
      description: taskData.description?.trim() || '',
      columnId: taskData.columnId || 'todo',
      issueType: taskData.issueType || 'task',
      priority: taskData.priority || 'medium',
      assigneeId: taskData.assigneeId || (TEAM_MEMBERS.find((m) => m.isCurrentUser) || TEAM_MEMBERS[0]).id,
      tags: Array.isArray(taskData.tags) ? taskData.tags : [],
      storyPoints: taskData.storyPoints ? Number(taskData.storyPoints) : 1,
      dueDate: taskData.dueDate || '',
      subtasks: taskData.subtasks || [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTasks((prev) => [newTask, ...prev]);
    addToast('Task Created', `Created issue ${newTask.id}: "${newTask.title.slice(0, 30)}..."`, 'success');
    return newTask;
  }, [generateNextIssueKey, addToast]);

  const updateTask = useCallback((taskId, updates) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            ...updates,
            updatedAt: new Date().toISOString()
          };
        }
        return task;
      })
    );
    addToast('Task Updated', `Changes saved for ${taskId}`, 'info');
  }, [addToast]);

  const deleteTask = useCallback((taskId) => {
    const target = tasks.find((t) => t.id === taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
    }
    setDeleteConfirmTask(null);
    addToast('Task Deleted', `Removed issue ${taskId}${target ? ` (${target.title.slice(0, 25)})` : ''}`, 'warning');
  }, [tasks, selectedTaskId, addToast]);

  // Move / Reorder Task
  const moveTask = useCallback((taskId, targetColumnId, newIndex = null) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const sourceColumnId = task.columnId;
    const isColumnChange = sourceColumnId !== targetColumnId;

    if (targetColumnId === 'done' && isColumnChange) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Fallback gracefully
      }
    }

    setTasks((prev) => {
      const withoutTask = prev.filter((t) => t.id !== taskId);
      const updatedTask = {
        ...task,
        columnId: targetColumnId,
        updatedAt: new Date().toISOString()
      };

      if (newIndex === null || newIndex === undefined) {
        return [...withoutTask, updatedTask];
      }

      const targetColumnTasks = withoutTask.filter((t) => t.columnId === targetColumnId);
      const otherColumnTasks = withoutTask.filter((t) => t.columnId !== targetColumnId);

      const clampedIndex = Math.max(0, Math.min(newIndex, targetColumnTasks.length));
      targetColumnTasks.splice(clampedIndex, 0, updatedTask);

      return [...otherColumnTasks, ...targetColumnTasks];
    });

    if (isColumnChange) {
      const colObj = columns.find((c) => c.id === targetColumnId);
      addToast('Status Changed', `${taskId} moved to ${colObj ? colObj.title : targetColumnId}`, 'success');
    }
  }, [tasks, columns, addToast]);

  // Subtask management
  const addSubtask = useCallback((taskId, title) => {
    if (!title?.trim()) return;
    const newSubtask = {
      id: `sub-${Date.now()}`,
      title: title.trim(),
      completed: false
    };

    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: [...(task.subtasks || []), newSubtask],
            updatedAt: new Date().toISOString()
          };
        }
        return task;
      })
    );
  }, []);

  const toggleSubtask = useCallback((taskId, subtaskId) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const updatedSubtasks = (task.subtasks || []).map((sub) =>
            sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
          );
          return {
            ...task,
            subtasks: updatedSubtasks,
            updatedAt: new Date().toISOString()
          };
        }
        return task;
      })
    );
  }, []);

  const deleteSubtask = useCallback((taskId, subtaskId) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: (task.subtasks || []).filter((sub) => sub.id !== subtaskId),
            updatedAt: new Date().toISOString()
          };
        }
        return task;
      })
    );
  }, []);

  // Comments management
  const addComment = useCallback((taskId, text, authorName) => {
    if (!text?.trim()) return;
    const defaultUser = TEAM_MEMBERS.find((m) => m.isCurrentUser) || TEAM_MEMBERS[0];
    const authorObj = authorName
      ? (TEAM_MEMBERS.find((m) => m.name === authorName) || defaultUser)
      : defaultUser;
    const newComment = {
      id: `comment-${Date.now()}`,
      author: authorObj.name,
      avatar: authorObj.initials || getInitials(authorObj.name),
      text: text.trim(),
      createdAt: new Date().toISOString()
    };

    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            comments: [...(task.comments || []), newComment],
            updatedAt: new Date().toISOString()
          };
        }
        return task;
      })
    );
    addToast('Comment Posted', `Added feedback to ${taskId}`, 'info');
  }, [addToast]);

  // Reset to sample mock data
  const resetToMockData = useCallback(() => {
    setTasks(INITIAL_TASKS);
    setColumns(COLUMNS);
    setSelectedTaskId(null);
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(INITIAL_TASKS));
    localStorage.setItem(STORAGE_KEY_COLUMNS, JSON.stringify(COLUMNS));
    addToast('Board Reset', 'Restored initial sample Jira workspace data', 'info');
  }, [addToast]);

  // Filtered tasks computation
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description.toLowerCase().includes(query);
        const matchesId = task.id.toLowerCase().includes(query);
        const matchesTags = task.tags?.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesId && !matchesTags) {
          return false;
        }
      }

      if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
        return false;
      }

      if (typeFilter !== 'all' && task.issueType !== typeFilter) {
        return false;
      }

      if (assigneeFilter !== 'all' && task.assigneeId !== assigneeFilter) {
        return false;
      }

      if (quickFilter === 'my_issues') {
        const currentUser = TEAM_MEMBERS.find((m) => m.isCurrentUser) || TEAM_MEMBERS[0];
        if (task.assigneeId !== currentUser?.id) return false;
      } else if (quickFilter === 'bugs') {
        if (task.issueType !== 'bug') return false;
      } else if (quickFilter === 'high_priority') {
        if (task.priority !== 'high' && task.priority !== 'urgent') return false;
      }

      return true;
    });
  }, [tasks, searchQuery, priorityFilter, typeFilter, assigneeFilter, quickFilter]);

  const openCreateModal = useCallback((colId = 'todo') => {
    setCreateModalDefaultColumn(colId);
    setIsCreateModalOpen(true);
  }, []);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tagName = e.target.tagName?.toLowerCase();
      const isInput = tagName === 'input' || tagName === 'textarea' || e.target.isContentEditable;

      if (e.key === 'Escape') {
        if (deleteConfirmTask) {
          setDeleteConfirmTask(null);
          return;
        }
        if (selectedTaskId) {
          setSelectedTaskId(null);
          return;
        }
        if (isCreateModalOpen) {
          setIsCreateModalOpen(false);
          return;
        }
      }

      if (isInput) return;

      if ((e.key === 'c' || e.key === 'C') && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        openCreateModal('todo');
      } else if (e.key === '/' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        const searchInput = document.getElementById('board-search-input');
        if (searchInput) searchInput.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTaskId, isCreateModalOpen, deleteConfirmTask, openCreateModal]);

  const value = {
    theme,
    toggleTheme,
    isSidebarCollapsed,
    toggleSidebar,
    columns,
    tasks,
    filteredTasks,
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter,
    typeFilter,
    setTypeFilter,
    assigneeFilter,
    setAssigneeFilter,
    quickFilter,
    setQuickFilter,
    activeView,
    setActiveView,
    selectedTask,
    setSelectedTask,
    isCreateModalOpen,
    setIsCreateModalOpen,
    createModalDefaultColumn,
    openCreateModal,
    deleteConfirmTask,
    setDeleteConfirmTask,
    draggingTaskId,
    setDraggingTaskId,
    dragOverColumnId,
    setDragOverColumnId,
    dragOverTargetIndex,
    setDragOverTargetIndex,
    toasts,
    addToast,
    removeToast,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    addComment,
    resetToMockData
  };

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
};

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
};
