import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';
import { ReportStatus } from '../../types/expense-report.types';

describe('Badge', () => {
  it('should render CREATED status', () => {
    render(<Badge status={ReportStatus.CREATED} />);
    expect(screen.getByText('Created')).toBeInTheDocument();
  });

  it('should render SUBMITTED status', () => {
    render(<Badge status={ReportStatus.SUBMITTED} />);
    expect(screen.getByText('Submitted')).toBeInTheDocument();
  });

  it('should render VALIDATED status', () => {
    render(<Badge status={ReportStatus.VALIDATED} />);
    expect(screen.getByText('Validated')).toBeInTheDocument();
  });

  it('should render PAID status', () => {
    render(<Badge status={ReportStatus.PAID} />);
    expect(screen.getByText('Paid')).toBeInTheDocument();
  });

  it('should render REJECTED status', () => {
    render(<Badge status={ReportStatus.REJECTED} />);
    expect(screen.getByText('Denied')).toBeInTheDocument();
  });

  it('should apply correct color for CREATED status', () => {
    render(<Badge status={ReportStatus.CREATED} />);
    const badge = screen.getByText('Created');
    expect(badge.className).toContain('text-amber-500');
  });

  it('should apply correct color for SUBMITTED status', () => {
    render(<Badge status={ReportStatus.SUBMITTED} />);
    const badge = screen.getByText('Submitted');
    expect(badge.className).toContain('text-blue-500');
  });

  it('should apply correct color for VALIDATED status', () => {
    render(<Badge status={ReportStatus.VALIDATED} />);
    const badge = screen.getByText('Validated');
    expect(badge.className).toContain('text-lime-500');
  });

  it('should apply correct color for PAID status', () => {
    render(<Badge status={ReportStatus.PAID} />);
    const badge = screen.getByText('Paid');
    expect(badge.className).toContain('text-emerald-500');
  });

  it('should apply correct color for REJECTED status', () => {
    render(<Badge status={ReportStatus.REJECTED} />);
    const badge = screen.getByText('Denied');
    expect(badge.className).toContain('text-red-500');
  });

  it('should render small size by default', () => {
    render(<Badge status={ReportStatus.CREATED} />);
    const badge = screen.getByText('Created');
    expect(badge.className).toContain('text-sm');
  });

  it('should render medium size', () => {
    render(<Badge status={ReportStatus.CREATED} size="md" />);
    const badge = screen.getByText('Created');
    expect(badge.className).toContain('text-base');
  });
});
