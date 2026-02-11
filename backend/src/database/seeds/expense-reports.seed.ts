import { DataSource } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ExpenseReport } from '../../expense-reports/entities/expense-report.entity';
import { Expense } from '../../expenses/entities/expense.entity';
import { ReportStatus } from '../../common/enums/report-status.enum';
import { ExpenseCategory } from '../../common/enums/expense-category.enum';
import { ExpenseStatus } from '../../common/enums/expense-status.enum';
import { UserRole } from '../../common/enums/user-role.enum';

/**
 * Seed expense reports data matching the UI mockup
 * Creates 4 expense reports with their associated expenses
 */
export async function seedExpenseReports(dataSource: DataSource) {
  const userRepo = dataSource.getRepository(User);
  const reportRepo = dataSource.getRepository(ExpenseReport);
  const expenseRepo = dataSource.getRepository(Expense);

  console.log('🌱 Seeding expense reports...');

  // 1. Create or get user
  let user = await userRepo.findOne({ where: { email: 'john.doe@example.com' } });
  
  if (!user) {
    user = userRepo.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      role: UserRole.EMPLOYEE,
    });
    await userRepo.save(user);
    console.log('✅ User created: john.doe@example.com');
  } else {
    console.log('✅ User found: john.doe@example.com');
  }

  // Clear existing reports for this user to avoid duplicates
  const existingReports = await reportRepo.find({ where: { userId: user.id } });
  if (existingReports.length > 0) {
    await reportRepo.remove(existingReports);
    console.log(`🗑️  Removed ${existingReports.length} existing reports`);
  }

  // 2. Report 1: Q4 Client On-site - $175.00 - Submitted
  const report1 = reportRepo.create({
    purpose: 'Q4 Client On-site',
    reportDate: new Date('2023-10-26'),
    totalAmount: 0, // Will be calculated
    status: ReportStatus.SUBMITTED,
    userId: user.id,
  });
  await reportRepo.save(report1);

  const expense1_1 = expenseRepo.create({
    reportId: report1.id,
    category: ExpenseCategory.MEALS,
    expenseName: 'Client Lunch',
    description: 'Business lunch with client',
    amount: 85.00,
    expenseDate: new Date('2023-10-26'),
    status: ExpenseStatus.VALIDATED,
  });

  const expense1_2 = expenseRepo.create({
    reportId: report1.id,
    category: ExpenseCategory.TRAVEL,
    expenseName: 'Flight to Client Site',
    description: 'Round trip flight',
    amount: 90.00,
    expenseDate: new Date('2023-10-26'),
    status: ExpenseStatus.VALIDATED,
  });

  await expenseRepo.save([expense1_1, expense1_2]);

  // Update total amount
  report1.totalAmount = 175.00;
  await reportRepo.save(report1);
  console.log('✅ Report 1: Q4 Client On-site ($175.00)');

  // 3. Report 2: October Office Supplies - $75.00 - Validated
  const report2 = reportRepo.create({
    purpose: 'October Office Supplies',
    reportDate: new Date('2023-10-24'),
    totalAmount: 0,
    status: ReportStatus.VALIDATED,
    userId: user.id,
  });
  await reportRepo.save(report2);

  const expense2_1 = expenseRepo.create({
    reportId: report2.id,
    category: ExpenseCategory.OFFICE_SUPPLIES,
    expenseName: 'Office Supplies',
    description: 'Pens, notebooks, folders',
    amount: 75.00,
    expenseDate: new Date('2023-10-24'),
    status: ExpenseStatus.VALIDATED,
  });

  await expenseRepo.save(expense2_1);

  report2.totalAmount = 75.00;
  await reportRepo.save(report2);
  console.log('✅ Report 2: October Office Supplies ($75.00)');

  // 4. Report 3: Team Offsite Event - $215.00 - Paid
  const report3 = reportRepo.create({
    purpose: 'Team Offsite Event',
    reportDate: new Date('2023-10-22'),
    totalAmount: 0,
    status: ReportStatus.PAID,
    paymentDate: new Date('2023-10-30'),
    userId: user.id,
  });
  await reportRepo.save(report3);

  const expense3_1 = expenseRepo.create({
    reportId: report3.id,
    category: ExpenseCategory.OTHER,
    expenseName: 'Team Building Activity',
    description: 'Team offsite event',
    amount: 180.00,
    expenseDate: new Date('2023-10-22'),
    status: ExpenseStatus.VALIDATED,
  });

  const expense3_2 = expenseRepo.create({
    reportId: report3.id,
    category: ExpenseCategory.TRANSPORT,
    expenseName: 'Parking',
    description: 'Event venue parking',
    amount: 35.00,
    expenseDate: new Date('2023-10-22'),
    status: ExpenseStatus.VALIDATED,
  });

  await expenseRepo.save([expense3_1, expense3_2]);

  report3.totalAmount = 215.00;
  await reportRepo.save(report3);
  console.log('✅ Report 3: Team Offsite Event ($215.00)');

  // 5. Report 4: Commute & Meals - $40.00 - Created
  const report4 = reportRepo.create({
    purpose: 'Commute & Meals',
    reportDate: new Date('2023-10-21'),
    totalAmount: 0,
    status: ReportStatus.CREATED,
    userId: user.id,
  });
  await reportRepo.save(report4);

  const expense4_1 = expenseRepo.create({
    reportId: report4.id,
    category: ExpenseCategory.TRANSPORT,
    expenseName: 'Parking',
    description: 'Office parking',
    amount: 15.00,
    expenseDate: new Date('2023-10-21'),
    status: ExpenseStatus.CREATED,
  });

  const expense4_2 = expenseRepo.create({
    reportId: report4.id,
    category: ExpenseCategory.MEALS,
    expenseName: 'Lunch',
    description: 'Working lunch',
    amount: 25.00,
    expenseDate: new Date('2023-10-21'),
    status: ExpenseStatus.CREATED,
  });

  await expenseRepo.save([expense4_1, expense4_2]);

  report4.totalAmount = 40.00;
  await reportRepo.save(report4);
  console.log('✅ Report 4: Commute & Meals ($40.00)');

  console.log('🎉 Expense reports seeded successfully!');
}
