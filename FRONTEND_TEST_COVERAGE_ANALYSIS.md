# Frontend Test Coverage Analysis

**Date:** 2026-02-11  
**Project:** Expense Management Frontend (React + Vitest)  
**Target Coverage:** 80% (statements, lines, branches, functions)

## Executive Summary

### Current Status
- **Test Files:** 2 test files exist (StatusPage.test.tsx, useHealth.test.ts)
- **Test Status:** 1 test file failing (StatusPage.test.tsx has 1 failing test)
- **Coverage Report:** Unable to generate due to failing tests
- **Estimated Coverage:** ~5% (only 2 files out of 60+ source files have tests)

### Critical Issues
1. **Failing Test:** StatusPage.test.tsx has a failing test that prevents coverage report generation
2. **Minimal Coverage:** Only 2 components/hooks have tests out of 60+ source files
3. **Missing Tests:** No tests for recently added ExpenseDetailsPage and useExpenseDetails hook
4. **Zero API Coverage:** No tests for any API client files
5. **Zero Utility Coverage:** No tests for utility functions

---

## Detailed Analysis by Module

### 1. Pages (0/7 tested - 0%)

#### ✅ Tested
- [`StatusPage.tsx`](frontend/src/pages/StatusPage.tsx) - **HAS TESTS** (but 1 failing)
  - Test file: [`tests/StatusPage.test.tsx`](frontend/tests/StatusPage.test.tsx)
  - Tests: 5 tests (4 passing, 1 failing)
  - Issue: "displays DB error when database fails" test is failing

#### ❌ Missing Tests (Priority Order)
1. **HIGH PRIORITY** - [`ExpenseDetailsPage.tsx`](frontend/src/pages/ExpenseDetailsPage.tsx)
   - Recently added component (mentioned in requirements)
   - Complex page with expense detail viewing/editing
   - Needs comprehensive tests for CRUD operations

2. **HIGH PRIORITY** - [`ExpenseReportDetailsPage.tsx`](frontend/src/pages/ExpenseReportDetailsPage.tsx)
   - Core functionality page
   - Displays expense report with list of expenses
   - Needs tests for data loading, filtering, and interactions

3. **HIGH PRIORITY** - [`ExpenseReportsPage.tsx`](frontend/src/pages/ExpenseReportsPage.tsx)
   - Main landing page for expense reports
   - Complex filtering and search functionality
   - Needs tests for filters, search, pagination

4. **MEDIUM PRIORITY** - [`CreateExpensePage.tsx`](frontend/src/pages/CreateExpensePage.tsx)
   - Form submission page
   - Needs tests for validation, file upload, form submission

5. **MEDIUM PRIORITY** - [`NewReportPage.tsx`](frontend/src/pages/NewReportPage.tsx)
   - Report creation form
   - Needs tests for form validation and submission

6. **LOW PRIORITY** - [`ProfilePage.tsx`](frontend/src/pages/ProfilePage.tsx)
   - User profile display
   - Simpler component, lower priority

---

### 2. Hooks (1/9 tested - 11%)

#### ✅ Tested
- [`useHealth.ts`](frontend/src/hooks/useHealth.ts) - **HAS TESTS**
  - Test file: [`tests/useHealth.test.ts`](frontend/tests/useHealth.test.ts)
  - Tests: 3 tests (all passing)
  - Coverage: Good coverage of loading, error, and refetch scenarios

#### ❌ Missing Tests (Priority Order)
1. **HIGH PRIORITY** - [`useExpenseDetails.ts`](frontend/src/hooks/useExpenseDetails.ts)
   - Recently added hook (mentioned in requirements)
   - Manages expense detail state and operations
   - Needs tests for fetch, update, delete operations

2. **HIGH PRIORITY** - [`useExpenseReportDetails.ts`](frontend/src/hooks/useExpenseReportDetails.ts)
   - Core data fetching hook
   - Manages expense report details state
   - Needs tests for loading, error handling, refetch

3. **HIGH PRIORITY** - [`useExpenseReports.ts`](frontend/src/hooks/useExpenseReports.ts)
   - Main data fetching hook for reports list
   - Needs tests for pagination, filtering, search integration

4. **HIGH PRIORITY** - [`useExpense.ts`](frontend/src/hooks/useExpense.ts)
   - Manages individual expense operations
   - Needs tests for CRUD operations

5. **MEDIUM PRIORITY** - [`useFilters.ts`](frontend/src/hooks/useFilters.ts)
   - Complex filter state management
   - Needs tests for filter application, clearing, state updates

6. **MEDIUM PRIORITY** - [`useSearch.ts`](frontend/src/hooks/useSearch.ts)
   - Search functionality hook
   - Needs tests for search state management

7. **MEDIUM PRIORITY** - [`useDebounce.ts`](frontend/src/hooks/useDebounce.ts)
   - Utility hook for debouncing
   - Needs tests for debounce timing and value updates

8. **LOW PRIORITY** - [`useUser.ts`](frontend/src/hooks/useUser.ts)
   - User data fetching hook
   - Needs tests for user data loading

---

### 3. Components (0/30 tested - 0%)

#### Common Components (0/17 tested)
**HIGH PRIORITY:**
- [`Button.tsx`](frontend/src/components/common/Button.tsx) - Core UI component, heavily reused
- [`FormInput.tsx`](frontend/src/components/common/FormInput.tsx) - Form input with validation
- [`FormSelect.tsx`](frontend/src/components/common/FormSelect.tsx) - Dropdown component
- [`FormDateInput.tsx`](frontend/src/components/common/FormDateInput.tsx) - Date picker
- [`FormTextarea.tsx`](frontend/src/components/common/FormTextarea.tsx) - Textarea with validation
- [`FileUpload.tsx`](frontend/src/components/common/FileUpload.tsx) - File upload component
- [`SearchInput.tsx`](frontend/src/components/common/SearchInput.tsx) - Search input with debounce

**MEDIUM PRIORITY:**
- [`Header.tsx`](frontend/src/components/common/Header.tsx) - Navigation header
- [`Badge.tsx`](frontend/src/components/common/Badge.tsx) - Status badge component
- [`CategoryIcon.tsx`](frontend/src/components/common/CategoryIcon.tsx) - Icon display
- [`DateSelector.tsx`](frontend/src/components/common/DateSelector.tsx) - Date range selector
- [`EditableTitle.tsx`](frontend/src/components/common/EditableTitle.tsx) - Inline editing
- [`FilterPill.tsx`](frontend/src/components/common/FilterPill.tsx) - Filter tag display
- [`IconButton.tsx`](frontend/src/components/common/IconButton.tsx) - Icon button
- [`SuccessModal.tsx`](frontend/src/components/common/SuccessModal.tsx) - Success notification

**LOW PRIORITY:**
- [`LoadingSpinner.tsx`](frontend/src/components/LoadingSpinner.tsx) - Simple spinner
- [`StatusCard.tsx`](frontend/src/components/StatusCard.tsx) - Status display card

#### Expense Reports Components (0/6 tested)
**HIGH PRIORITY:**
- [`ExpenseReportCard.tsx`](frontend/src/components/expense-reports/ExpenseReportCard.tsx) - Report card display
- [`ExpenseReportList.tsx`](frontend/src/components/expense-reports/ExpenseReportList.tsx) - List of reports
- [`ExpenseItem.tsx`](frontend/src/components/expense-reports/ExpenseItem.tsx) - Individual expense item
- [`FilterModal.tsx`](frontend/src/components/expense-reports/FilterModal.tsx) - Filter modal dialog
- [`ActiveFilters.tsx`](frontend/src/components/expense-reports/ActiveFilters.tsx) - Active filters display
- [`ExpenseReportHeader.tsx`](frontend/src/components/expense-reports/ExpenseReportHeader.tsx) - Report header

#### Layout Components (0/1 tested)
**LOW PRIORITY:**
- [`Footer.tsx`](frontend/src/components/layout/Footer.tsx) - Page footer

---

### 4. API Clients (0/5 tested - 0%)

**HIGH PRIORITY:**
- [`expense-reports.api.ts`](frontend/src/api/expense-reports.api.ts)
  - CRUD operations for expense reports
  - Needs tests for all API methods (GET, POST, PUT, DELETE)
  
- [`expenses.api.ts`](frontend/src/api/expenses.api.ts)
  - CRUD operations for expenses
  - Needs tests for all API methods

**MEDIUM PRIORITY:**
- [`users.api.ts`](frontend/src/api/users.api.ts)
  - User data fetching
  - Needs tests for user API calls

- [`client.ts`](frontend/src/api/client.ts)
  - Axios client configuration
  - Needs tests for interceptors, error handling

**LOW PRIORITY:**
- [`health.api.ts`](frontend/src/api/health.api.ts)
  - Health check API (indirectly tested via useHealth hook)

---

### 5. Utilities (0/3 tested - 0%)

**HIGH PRIORITY:**
- [`currency.utils.ts`](frontend/src/utils/currency.utils.ts)
  - Currency formatting functions
  - Critical for display accuracy
  - Needs tests for various currency formats and edge cases

- [`date.utils.ts`](frontend/src/utils/date.utils.ts)
  - Date formatting and manipulation
  - Critical for date display and calculations
  - Needs tests for formatting, parsing, timezone handling

**MEDIUM PRIORITY:**
- [`category.utils.ts`](frontend/src/utils/category.utils.ts)
  - Category-related utility functions
  - Needs tests for category operations

---

### 6. Constants (0/2 tested - 0%)

**LOW PRIORITY:**
- [`categories.ts`](frontend/src/constants/categories.ts) - Category definitions
- [`statuses.ts`](frontend/src/constants/statuses.ts) - Status definitions
- Note: Constants typically don't need tests unless they contain logic

---

### 7. Types (0/2 tested - 0%)

**NO TESTS NEEDED:**
- [`expense-report.types.ts`](frontend/src/types/expense-report.types.ts) - TypeScript types
- [`filter.types.ts`](frontend/src/types/filter.types.ts) - TypeScript types
- Note: TypeScript types don't require runtime tests

---

## Priority Test Implementation Plan

### Phase 1: Critical Infrastructure (Week 1)
**Goal:** Fix failing tests and establish testing patterns

1. **Fix Failing Test**
   - Fix StatusPage.test.tsx failing test
   - Ensure all existing tests pass
   - Generate baseline coverage report

2. **Utility Functions** (100% coverage target)
   - `currency.utils.ts` - 10-15 tests
   - `date.utils.ts` - 15-20 tests
   - `category.utils.ts` - 5-10 tests

3. **Core Hooks** (95% coverage target)
   - `useExpenseDetails.ts` - 8-10 tests
   - `useExpenseReportDetails.ts` - 8-10 tests
   - `useExpenseReports.ts` - 10-12 tests
   - `useExpense.ts` - 8-10 tests

### Phase 2: API Layer (Week 2)
**Goal:** Ensure API reliability

4. **API Clients** (90% coverage target)
   - `expense-reports.api.ts` - 12-15 tests
   - `expenses.api.ts` - 12-15 tests
   - `users.api.ts` - 5-8 tests
   - `client.ts` - 8-10 tests

### Phase 3: Core Components (Week 3)
**Goal:** Test user-facing components

5. **Form Components** (85% coverage target)
   - `FormInput.tsx` - 8-10 tests
   - `FormSelect.tsx` - 8-10 tests
   - `FormDateInput.tsx` - 8-10 tests
   - `FormTextarea.tsx` - 6-8 tests
   - `FileUpload.tsx` - 10-12 tests

6. **Common Components** (80% coverage target)
   - `Button.tsx` - 6-8 tests
   - `SearchInput.tsx` - 8-10 tests
   - `Header.tsx` - 6-8 tests
   - `Badge.tsx` - 4-6 tests
   - `CategoryIcon.tsx` - 4-6 tests

### Phase 4: Pages (Week 4)
**Goal:** Integration testing for pages

7. **High Priority Pages** (80% coverage target)
   - `ExpenseDetailsPage.tsx` - 15-20 tests
   - `ExpenseReportDetailsPage.tsx` - 15-20 tests
   - `ExpenseReportsPage.tsx` - 20-25 tests
   - `CreateExpensePage.tsx` - 15-18 tests
   - `NewReportPage.tsx` - 12-15 tests

8. **Supporting Hooks** (85% coverage target)
   - `useFilters.ts` - 10-12 tests
   - `useSearch.ts` - 6-8 tests
   - `useDebounce.ts` - 4-6 tests
   - `useUser.ts` - 5-7 tests

### Phase 5: Remaining Components (Week 5)
**Goal:** Complete coverage

9. **Expense Report Components** (80% coverage target)
   - `ExpenseReportCard.tsx` - 8-10 tests
   - `ExpenseReportList.tsx` - 10-12 tests
   - `ExpenseItem.tsx` - 8-10 tests
   - `FilterModal.tsx` - 12-15 tests
   - `ActiveFilters.tsx` - 6-8 tests
   - `ExpenseReportHeader.tsx` - 6-8 tests

10. **Remaining Common Components** (75% coverage target)
    - `DateSelector.tsx` - 8-10 tests
    - `EditableTitle.tsx` - 8-10 tests
    - `FilterPill.tsx` - 4-6 tests
    - `IconButton.tsx` - 4-6 tests
    - `SuccessModal.tsx` - 6-8 tests
    - `LoadingSpinner.tsx` - 2-3 tests
    - `StatusCard.tsx` - 4-6 tests
    - `Footer.tsx` - 2-3 tests

11. **Low Priority Pages** (75% coverage target)
    - `ProfilePage.tsx` - 8-10 tests

---

## Test File Organization

### Recommended Structure
```
frontend/tests/
├── setup.ts                          # ✅ Exists
├── pages/
│   ├── StatusPage.test.tsx          # ✅ Exists (move here)
│   ├── ExpenseDetailsPage.test.tsx  # ❌ Create
│   ├── ExpenseReportDetailsPage.test.tsx
│   ├── ExpenseReportsPage.test.tsx
│   ├── CreateExpensePage.test.tsx
│   ├── NewReportPage.test.tsx
│   └── ProfilePage.test.tsx
├── hooks/
│   ├── useHealth.test.ts            # ✅ Exists (move here)
│   ├── useExpenseDetails.test.ts    # ❌ Create
│   ├── useExpenseReportDetails.test.ts
│   ├── useExpenseReports.test.ts
│   ├── useExpense.test.ts
│   ├── useFilters.test.ts
│   ├── useSearch.test.ts
│   ├── useDebounce.test.ts
│   └── useUser.test.ts
├── components/
│   ├── common/
│   │   ├── Button.test.tsx
│   │   ├── FormInput.test.tsx
│   │   ├── FormSelect.test.tsx
│   │   ├── FormDateInput.test.tsx
│   │   ├── FormTextarea.test.tsx
│   │   ├── FileUpload.test.tsx
│   │   ├── SearchInput.test.tsx
│   │   ├── Header.test.tsx
│   │   ├── Badge.test.tsx
│   │   ├── CategoryIcon.test.tsx
│   │   ├── DateSelector.test.tsx
│   │   ├── EditableTitle.test.tsx
│   │   ├── FilterPill.test.tsx
│   │   ├── IconButton.test.tsx
│   │   └── SuccessModal.test.tsx
│   ├── expense-reports/
│   │   ├── ExpenseReportCard.test.tsx
│   │   ├── ExpenseReportList.test.tsx
│   │   ├── ExpenseItem.test.tsx
│   │   ├── FilterModal.test.tsx
│   │   ├── ActiveFilters.test.tsx
│   │   └── ExpenseReportHeader.test.tsx
│   ├── LoadingSpinner.test.tsx
│   └── StatusCard.test.tsx
├── api/
│   ├── expense-reports.api.test.ts
│   ├── expenses.api.test.ts
│   ├── users.api.test.ts
│   ├── health.api.test.ts
│   └── client.test.ts
└── utils/
    ├── currency.utils.test.ts
    ├── date.utils.test.ts
    └── category.utils.test.ts
```

---

## Testing Standards & Best Practices

### Test Naming Convention
- File: `*.test.tsx` or `*.test.ts`
- Describe blocks: Match component/function name
- Test cases: `should [expected behavior] when [condition]`

### Coverage Targets by Type
- **Utilities:** 100% (pure functions, easy to test)
- **Hooks:** 95% (core business logic)
- **API Clients:** 90% (critical for data integrity)
- **Form Components:** 85% (complex validation logic)
- **Pages:** 80% (integration tests)
- **Display Components:** 75% (simpler components)

### Required Test Scenarios
1. **All Components:**
   - Renders without crashing
   - Displays correct content
   - Handles props correctly
   - Handles user interactions

2. **Hooks:**
   - Initial state
   - Loading states
   - Success scenarios
   - Error handling
   - Refetch/retry logic

3. **API Clients:**
   - Successful requests
   - Error responses (4xx, 5xx)
   - Network errors
   - Request/response transformation

4. **Forms:**
   - Valid input
   - Invalid input
   - Validation errors
   - Submission success
   - Submission failure

---

## Estimated Effort

### Total Test Files Needed: 58
- Pages: 6 new test files
- Hooks: 8 new test files
- Components: 30 new test files
- API Clients: 5 new test files
- Utils: 3 new test files
- Existing: 2 test files (1 needs fixing)

### Time Estimates
- **Phase 1 (Critical):** 40-50 hours
- **Phase 2 (API Layer):** 30-40 hours
- **Phase 3 (Core Components):** 40-50 hours
- **Phase 4 (Pages):** 50-60 hours
- **Phase 5 (Remaining):** 40-50 hours

**Total Estimated Effort:** 200-250 hours (5-6 weeks with 1 developer)

---

## Immediate Action Items

### This Week
1. ✅ **Fix failing test** in StatusPage.test.tsx
2. ✅ **Create test files** for ExpenseDetailsPage and useExpenseDetails
3. ✅ **Implement utility tests** (currency, date, category)
4. ✅ **Generate baseline coverage report**

### Next Week
5. ✅ **Implement core hook tests** (useExpenseReportDetails, useExpenseReports, useExpense)
6. ✅ **Implement API client tests** (expense-reports.api, expenses.api)
7. ✅ **Set up CI/CD** to enforce coverage thresholds

---

## Coverage Thresholds Configuration

Current configuration in [`vitest.config.ts`](frontend/vitest.config.ts:21-26):
```typescript
thresholds: {
  lines: 80,
  functions: 80,
  branches: 80,
  statements: 80,
}
```

**Recommendation:** Keep these thresholds but implement gradually:
- Week 1: Lower to 20% to allow incremental progress
- Week 2: Raise to 40%
- Week 3: Raise to 60%
- Week 4: Raise to 80% (target)

---

## Summary Statistics

| Category | Total Files | Tested | Missing | Coverage % |
|----------|-------------|--------|---------|------------|
| **Pages** | 7 | 1 | 6 | 14% |
| **Hooks** | 9 | 1 | 8 | 11% |
| **Components** | 30 | 0 | 30 | 0% |
| **API Clients** | 5 | 0 | 5 | 0% |
| **Utils** | 3 | 0 | 3 | 0% |
| **Constants** | 2 | 0 | 2 | 0% |
| **TOTAL** | **56** | **2** | **54** | **~4%** |

---

## Conclusion

The frontend currently has **minimal test coverage** with only 2 test files covering approximately 4% of the codebase. To reach the 80% coverage target:

1. **58 test files** need to be created
2. **1 failing test** needs to be fixed
3. **Estimated 200-250 hours** of development effort required
4. **5-6 weeks** timeline with dedicated developer

**Highest Priority:**
- Fix failing StatusPage test
- Test ExpenseDetailsPage and useExpenseDetails (recently added)
- Test utility functions (foundation for other tests)
- Test core hooks (business logic)
- Test API clients (data integrity)

The recommended approach is to implement tests in phases, starting with utilities and hooks (easier to test, high impact), then moving to API clients, components, and finally pages (integration tests).
