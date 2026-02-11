/**
 * Status Constants
 * Mapping between statuses and their display properties
 */

import { ReportStatus } from '../types/expense-report.types';

export const STATUS_COLORS: Record<ReportStatus, string> = {
  [ReportStatus.CREATED]: 'text-amber-500',
  [ReportStatus.SUBMITTED]: 'text-blue-500',
  [ReportStatus.VALIDATED]: 'text-lime-500',
  [ReportStatus.PAID]: 'text-emerald-500',
  [ReportStatus.REJECTED]: 'text-red-500',
};

export const STATUS_BG_COLORS: Record<ReportStatus, string> = {
  [ReportStatus.CREATED]: 'bg-amber-500/10 border-amber-500/20',
  [ReportStatus.SUBMITTED]: 'bg-blue-500/10 border-blue-500/20',
  [ReportStatus.VALIDATED]: 'bg-lime-500/10 border-lime-500/20',
  [ReportStatus.PAID]: 'bg-primary/10 border-primary/20',
  [ReportStatus.REJECTED]: 'bg-red-500/10 border-red-500/20',
};

export const STATUS_LABELS: Record<ReportStatus, string> = {
  [ReportStatus.CREATED]: 'Created',
  [ReportStatus.SUBMITTED]: 'Submitted',
  [ReportStatus.VALIDATED]: 'Validated',
  [ReportStatus.PAID]: 'Paid',
  [ReportStatus.REJECTED]: 'Denied',
};

export const FILTER_STATUSES = [
  { value: ReportStatus.SUBMITTED, label: STATUS_LABELS[ReportStatus.SUBMITTED] },
  { value: ReportStatus.VALIDATED, label: 'Approved' },
  { value: ReportStatus.REJECTED, label: STATUS_LABELS[ReportStatus.REJECTED] },
  { value: ReportStatus.PAID, label: STATUS_LABELS[ReportStatus.PAID] },
];
