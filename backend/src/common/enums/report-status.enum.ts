/**
 * Expense report status enum
 */
export enum ReportStatus {
  CREATED = 'CREATED',       // Draft, editable
  SUBMITTED = 'SUBMITTED',   // Submitted, awaiting validation
  VALIDATED = 'VALIDATED',   // Validated by manager (V2)
  REJECTED = 'REJECTED',     // Rejected by manager (V2)
  PAID = 'PAID',             // Paid
}
