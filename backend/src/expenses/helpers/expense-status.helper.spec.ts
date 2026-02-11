import { ExpenseStatusHelper } from './expense-status.helper';
import { ExpenseStatus } from '../../common/enums';

describe('ExpenseStatusHelper', () => {
  describe('canModify', () => {
    it('should return true for CREATED status', () => {
      expect(ExpenseStatusHelper.canModify(ExpenseStatus.CREATED)).toBe(true);
    });

    it('should return true for SUBMITTED status', () => {
      expect(ExpenseStatusHelper.canModify(ExpenseStatus.SUBMITTED)).toBe(true);
    });

    it('should return false for VALIDATED status', () => {
      expect(ExpenseStatusHelper.canModify(ExpenseStatus.VALIDATED)).toBe(false);
    });

    it('should return false for REJECTED status', () => {
      expect(ExpenseStatusHelper.canModify(ExpenseStatus.REJECTED)).toBe(false);
    });

    it('should return false for PAID status', () => {
      expect(ExpenseStatusHelper.canModify(ExpenseStatus.PAID)).toBe(false);
    });
  });

  describe('canDelete', () => {
    it('should return true for CREATED status', () => {
      expect(ExpenseStatusHelper.canDelete(ExpenseStatus.CREATED)).toBe(true);
    });

    it('should return true for SUBMITTED status', () => {
      expect(ExpenseStatusHelper.canDelete(ExpenseStatus.SUBMITTED)).toBe(true);
    });

    it('should return false for VALIDATED status', () => {
      expect(ExpenseStatusHelper.canDelete(ExpenseStatus.VALIDATED)).toBe(false);
    });

    it('should return false for REJECTED status', () => {
      expect(ExpenseStatusHelper.canDelete(ExpenseStatus.REJECTED)).toBe(false);
    });

    it('should return false for PAID status', () => {
      expect(ExpenseStatusHelper.canDelete(ExpenseStatus.PAID)).toBe(false);
    });
  });

  describe('canTransitionTo', () => {
    it('should allow CREATED -> SUBMITTED', () => {
      expect(
        ExpenseStatusHelper.canTransitionTo(ExpenseStatus.CREATED, ExpenseStatus.SUBMITTED),
      ).toBe(true);
    });

    it('should allow SUBMITTED -> VALIDATED', () => {
      expect(
        ExpenseStatusHelper.canTransitionTo(ExpenseStatus.SUBMITTED, ExpenseStatus.VALIDATED),
      ).toBe(true);
    });

    it('should allow SUBMITTED -> REJECTED', () => {
      expect(
        ExpenseStatusHelper.canTransitionTo(ExpenseStatus.SUBMITTED, ExpenseStatus.REJECTED),
      ).toBe(true);
    });

    it('should allow VALIDATED -> PAID', () => {
      expect(
        ExpenseStatusHelper.canTransitionTo(ExpenseStatus.VALIDATED, ExpenseStatus.PAID),
      ).toBe(true);
    });

    it('should allow REJECTED -> CREATED (reopen)', () => {
      expect(
        ExpenseStatusHelper.canTransitionTo(ExpenseStatus.REJECTED, ExpenseStatus.CREATED),
      ).toBe(true);
    });

    it('should not allow PAID -> any status', () => {
      expect(
        ExpenseStatusHelper.canTransitionTo(ExpenseStatus.PAID, ExpenseStatus.CREATED),
      ).toBe(false);
    });

    it('should not allow invalid transitions', () => {
      expect(
        ExpenseStatusHelper.canTransitionTo(ExpenseStatus.CREATED, ExpenseStatus.VALIDATED),
      ).toBe(false);
    });
  });
});
