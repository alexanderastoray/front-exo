# E2E Tests

End-to-end tests for the Expense Management application using Puppeteer.

## Prerequisites

- Backend server running on `http://localhost:3000`
- Frontend server running on `http://localhost:5173`

## Running Tests

### Run all E2E tests (headless mode)
```bash
npm run test:e2e
```

### Run tests with visible browser
```bash
npm run test:e2e:headed
```

### Run tests in debug mode
```bash
npm run test:e2e:debug
```

### Run tests with screenshots
```bash
npm run test:e2e:screenshot
```

## Test Structure

```
e2e/
├── config.ts                           # E2E test configuration
├── jest.config.js                      # Jest configuration for E2E tests
├── setup.ts                            # Global test setup
├── utils/
│   └── test-helpers.ts                 # Reusable test helper functions
├── health-status.e2e.test.ts          # Health check & status page tests
├── expense-reports-list.e2e.test.ts   # Expense reports list & filtering tests
├── create-expense-report.e2e.test.ts  # Create expense report tests
├── expense-report-details.e2e.test.ts # Report details & editing tests
├── expense-management.e2e.test.ts     # Expense CRUD operations tests
└── user-profile.e2e.test.ts           # User profile management tests
```

## Test Coverage

### Critical User Flows

1. **Health Check & Status Page**
   - Navigate to status page
   - Verify backend health status
   - Verify database status
   - Verify UI rendering

2. **Expense Reports List & Filtering**
   - Load and display expense reports
   - Search functionality
   - Filter by status
   - Filter by date range
   - Verify filtered results

3. **Create New Expense Report**
   - Navigate to new report page
   - Fill in report details
   - Submit form
   - Verify success message
   - Verify redirect
   - Verify new report in list

4. **View & Edit Expense Report Details**
   - Navigate to report details
   - View report information
   - Edit report title inline
   - Add expense to report
   - Verify updates

5. **Create & Manage Individual Expense**
   - Navigate to create expense page
   - Fill in expense details
   - Submit form
   - Edit expense
   - Delete expense
   - Verify deletion

6. **User Profile Management**
   - Navigate to profile page
   - View user information
   - Edit user name
   - Edit user email
   - Save changes
   - Verify updates

## Configuration

Configuration is managed in [`config.ts`](config.ts):

- **Base URLs**: Frontend and backend URLs
- **Timeouts**: Default, navigation, element, and API timeouts
- **Browser Options**: Headless mode, slow motion, devtools
- **Viewport**: Default viewport size
- **Screenshots**: Screenshot settings

## Environment Variables

- `FRONTEND_URL`: Frontend URL (default: `http://localhost:5173`)
- `BACKEND_URL`: Backend URL (default: `http://localhost:3000`)
- `HEADLESS`: Run in headless mode (default: `true`)
- `SLOW_MO`: Slow down Puppeteer operations (default: `0`)
- `DEVTOOLS`: Open browser devtools (default: `false`)
- `SCREENSHOT`: Enable screenshots (default: `false`)

## Helper Functions

The [`utils/test-helpers.ts`](utils/test-helpers.ts) file provides reusable helper functions:

- `navigateToPage()`: Navigate to a page
- `waitForElement()`: Wait for element to be visible
- `clickButton()`: Click button by text
- `fillInput()`: Fill form input
- `fillForm()`: Fill multiple form fields
- `getTextContent()`: Get element text content
- `takeScreenshot()`: Take screenshot for debugging
- `waitForApiResponse()`: Wait for API response
- And many more...

## Best Practices

1. **Independent Tests**: Each test should be independent and not rely on other tests
2. **Clean Up**: Tests should clean up after themselves
3. **Descriptive Names**: Use descriptive test names: `should [expected behavior] when [condition]`
4. **Proper Waits**: Use proper waits instead of arbitrary timeouts
5. **Screenshots**: Take screenshots on failures for debugging
6. **Error Handling**: Handle errors gracefully

## Troubleshooting

### Tests are failing

1. Ensure both backend and frontend servers are running
2. Check that the URLs in `config.ts` match your setup
3. Run tests in headed mode to see what's happening: `npm run test:e2e:headed`
4. Enable screenshots: `npm run test:e2e:screenshot`

### Tests are slow

1. Reduce the `SLOW_MO` value
2. Run tests in headless mode
3. Increase timeout values if needed

### Browser doesn't close

1. Ensure all tests have proper cleanup in `afterEach` and `afterAll` hooks
2. Check for unhandled promise rejections
3. Kill any orphaned browser processes manually

## CI/CD Integration

For CI/CD pipelines, use headless mode with screenshots enabled:

```bash
HEADLESS=true SCREENSHOT=true npm run test:e2e
```

Screenshots will be saved to `e2e/screenshots/` for debugging failed tests.
