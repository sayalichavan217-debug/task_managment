import React from 'react';
import { ChevronsUp, ChevronUp, Equal, ChevronDown } from 'lucide-react';
import { PRIORITIES } from '../../constants/data';

export const PriorityBadge = ({ priority = 'medium', showLabel = true, size = 13 }) => {
  const config = PRIORITIES[priority] || PRIORITIES.medium;

  const renderIcon = () => {
    switch (priority) {
      case 'urgent':
        return <ChevronsUp size={size} strokeWidth={2.8} />;
      case 'high':
        return <ChevronUp size={size} strokeWidth={2.5} />;
      case 'medium':
        return <Equal size={size} strokeWidth={2.5} />;
      case 'low':
      default:
        return <ChevronDown size={size} strokeWidth={2.5} />;
    }
  };

  return (
    <span
      className="priority-badge"
      style={{
        color: config.color,
        backgroundColor: config.bgColor,
        border: `1px solid ${config.borderColor}`
      }}
      title={`Priority: ${config.label}`}
    >
      {renderIcon()}
      {showLabel && <span>{config.label}</span>}
    </span>
  );
};
