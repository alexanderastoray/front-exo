import { ExpenseStatus } from '../../common/enums';

/**
 * Helper class for expense status business rules
 */
export class ExpenseStatusHelper {
  /**
   * Check if an expense can be modified based on its status
   */
  static canModify(status: ExpenseStatus): boolean {
    return [ExpenseStatus.CREATED, ExpenseStatus.SUBMITTED].includes(status);
  }

  /**
   * Check if an expense can be deleted based on its status
   */
  static canDelete(status: ExpenseStatus): boolean {
    return [ExpenseStatus.CREATED, ExpenseStatus.SUBMITTED].includes(status);
  }

  /**
   * Check if a status transition is valid
   */
  static canTransitionTo(from: ExpenseStatus, to: ExpenseStatus): boolean {
    const transitions: Record<ExpenseStatus, ExpenseStatus[]> = {
      [ExpenseStatus.CREATED]: [ExpenseStatus.SUBMITTED],
      [ExpenseStatus.SUBMITTED]: [
        ExpenseStatus.VALIDATED,
        ExpenseStatus.REJECTED,
      ],
      [ExpenseStatus.VALIDATED]: [ExpenseStatus.PAID],
      [ExpenseStatus.REJECTED]: [ExpenseStatus.CREATED],
      [ExpenseStatus.PAID]: [],
    };

    return transitions[from]?.includes(to) ?? false;
  }
}
