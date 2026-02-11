import { ReportStatusHelper } from './report-status.helper';
import { ReportStatus } from '../../common/enums';

describe('ReportStatusHelper', () => {
  describe('canModify', () => {
    it('should return true for CREATED status', () => {
      expect(ReportStatusHelper.canModify(ReportStatus.CREATED)).toBe(true);
    });

    it('should return true for SUBMITTED status', () => {
      expect(ReportStatusHelper.canModify(ReportStatus.SUBMITTED)).toBe(true);
    });

    it('should return false for VALIDATED status', () => {
      expect(ReportStatusHelper.canModify(ReportStatus.VALIDATED)).toBe(false);
    });

    it('should return false for REJECTED status', () => {
      expect(ReportStatusHelper.canModify(ReportStatus.REJECTED)).toBe(false);
    });

    it('should return false for PAID status', () => {
      expect(ReportStatusHelper.canModify(ReportStatus.PAID)).toBe(false);
    });
  });

  describe('canDelete', () => {
    it('should return true for CREATED status', () => {
      expect(ReportStatusHelper.canDelete(ReportStatus.CREATED)).toBe(true);
    });

    it('should return false for SUBMITTED status', () => {
      expect(ReportStatusHelper.canDelete(ReportStatus.SUBMITTED)).toBe(false);
    });

    it('should return false for VALIDATED status', () => {
      expect(ReportStatusHelper.canDelete(ReportStatus.VALIDATED)).toBe(false);
    });

    it('should return false for REJECTED status', () => {
      expect(ReportStatusHelper.canDelete(ReportStatus.REJECTED)).toBe(false);
    });

    it('should return false for PAID status', () => {
      expect(ReportStatusHelper.canDelete(ReportStatus.PAID)).toBe(false);
    });
  });

  describe('canTransitionTo', () => {
    it('should allow CREATED -> SUBMITTED', () => {
      expect(
        ReportStatusHelper.canTransitionTo(ReportStatus.CREATED, ReportStatus.SUBMITTED),
      ).toBe(true);
    });

    it('should allow SUBMITTED -> VALIDATED', () => {
      expect(
        ReportStatusHelper.canTransitionTo(ReportStatus.SUBMITTED, ReportStatus.VALIDATED),
      ).toBe(true);
    });

    it('should allow SUBMITTED -> REJECTED', () => {
      expect(
        ReportStatusHelper.canTransitionTo(ReportStatus.SUBMITTED, ReportStatus.REJECTED),
      ).toBe(true);
    });

    it('should allow SUBMITTED -> PAID (V1 shortcut)', () => {
      expect(
        ReportStatusHelper.canTransitionTo(ReportStatus.SUBMITTED, ReportStatus.PAID),
      ).toBe(true);
    });

    it('should allow VALIDATED -> PAID', () => {
      expect(
        ReportStatusHelper.canTransitionTo(ReportStatus.VALIDATED, ReportStatus.PAID),
      ).toBe(true);
    });

    it('should allow REJECTED -> CREATED (reopen)', () => {
      expect(
        ReportStatusHelper.canTransitionTo(ReportStatus.REJECTED, ReportStatus.CREATED),
      ).toBe(true);
    });

    it('should not allow PAID -> any status', () => {
      expect(
        ReportStatusHelper.canTransitionTo(ReportStatus.PAID, ReportStatus.CREATED),
      ).toBe(false);
    });

    it('should not allow invalid transitions', () => {
      expect(
        ReportStatusHelper.canTransitionTo(ReportStatus.CREATED, ReportStatus.VALIDATED),
      ).toBe(false);
    });
  });

  describe('getNextStatuses', () => {
    it('should return correct next statuses for CREATED', () => {
      const nextStatuses = ReportStatusHelper.getNextStatuses(ReportStatus.CREATED);
      expect(nextStatuses).toEqual([ReportStatus.SUBMITTED]);
    });

    it('should return correct next statuses for SUBMITTED', () => {
      const nextStatuses = ReportStatusHelper.getNextStatuses(ReportStatus.SUBMITTED);
      expect(nextStatuses).toEqual([
        ReportStatus.VALIDATED,
        ReportStatus.REJECTED,
        ReportStatus.PAID,
      ]);
    });

    it('should return correct next statuses for VALIDATED', () => {
      const nextStatuses = ReportStatusHelper.getNextStatuses(ReportStatus.VALIDATED);
      expect(nextStatuses).toEqual([ReportStatus.PAID]);
    });

    it('should return correct next statuses for REJECTED', () => {
      const nextStatuses = ReportStatusHelper.getNextStatuses(ReportStatus.REJECTED);
      expect(nextStatuses).toEqual([ReportStatus.CREATED]);
    });

    it('should return empty array for PAID', () => {
      const nextStatuses = ReportStatusHelper.getNextStatuses(ReportStatus.PAID);
      expect(nextStatuses).toEqual([]);
    });
  });
});
