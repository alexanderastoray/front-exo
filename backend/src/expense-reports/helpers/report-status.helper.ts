import { ReportStatus } from '../../common/enums';

/**
 * Helper class for expense report status business rules
 */
export class ReportStatusHelper {
  /**
   * Check if a report can be modified based on its status
   */
  static canModify(status: ReportStatus): boolean {
    return [ReportStatus.CREATED, ReportStatus.SUBMITTED].includes(status);
  }

  /**
   * Check if a report can be deleted based on its status
   */
  static canDelete(status: ReportStatus): boolean {
    return status === ReportStatus.CREATED;
  }

  /**
   * Check if a status transition is valid
   */
  static canTransitionTo(from: ReportStatus, to: ReportStatus): boolean {
    const transitions: Record<ReportStatus, ReportStatus[]> = {
      [ReportStatus.CREATED]: [ReportStatus.SUBMITTED],
      [ReportStatus.SUBMITTED]: [
        ReportStatus.VALIDATED,
        ReportStatus.REJECTED,
        ReportStatus.PAID, // V1 shortcut
      ],
      [ReportStatus.VALIDATED]: [ReportStatus.PAID],
      [ReportStatus.REJECTED]: [ReportStatus.CREATED], // V2: reopen
      [ReportStatus.PAID]: [],
    };

    return transitions[from]?.includes(to) ?? false;
  }

  /**
   * Get all possible next statuses for a given status
   */
  static getNextStatuses(status: ReportStatus): ReportStatus[] {
    const transitions: Record<ReportStatus, ReportStatus[]> = {
      [ReportStatus.CREATED]: [ReportStatus.SUBMITTED],
      [ReportStatus.SUBMITTED]: [
        ReportStatus.VALIDATED,
        ReportStatus.REJECTED,
        ReportStatus.PAID,
      ],
      [ReportStatus.VALIDATED]: [ReportStatus.PAID],
      [ReportStatus.REJECTED]: [ReportStatus.CREATED],
      [ReportStatus.PAID]: [],
    };

    return transitions[status] || [];
  }
}
