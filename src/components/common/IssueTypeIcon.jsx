import React from 'react';
import { Bookmark, CheckSquare, AlertCircle } from 'lucide-react';
import { ISSUE_TYPES } from '../../constants/data';

export const IssueTypeIcon = ({ type = 'task', size = 15 }) => {
  const typeConfig = ISSUE_TYPES[type] || ISSUE_TYPES.task;

  switch (type) {
    case 'story':
      return <Bookmark size={size} color={typeConfig.color} strokeWidth={2.5} />;
    case 'bug':
      return <AlertCircle size={size} color={typeConfig.color} strokeWidth={2.5} />;
    case 'task':
    default:
      return <CheckSquare size={size} color={typeConfig.color} strokeWidth={2.5} />;
  }
};
