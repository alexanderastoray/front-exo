/**
 * Badge Component
 * Displays status badges with appropriate colors
 */

import { ReportStatus } from '../../types/expense-report.types';
import { STATUS_COLORS, STATUS_LABELS } from '../../constants/statuses';

interface BadgeProps {
  status: ReportStatus;
  size?: 'sm' | 'md';
}

export function Badge({ status, size = 'sm' }: BadgeProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
  };

  return (
    <p className={`${sizeClasses[size]} ${STATUS_COLORS[status]} font-medium`}>
      {STATUS_LABELS[status]}
    </p>
  );
}
