import { DataSource } from 'typeorm';
import { seedExpenseReports } from './expense-reports.seed';

/**
 * Run database seeds
 * Usage: npm run seed
 */
async function runSeed() {
  const dataSource = new DataSource({
    type: 'sqlite',
    database: process.env.DB_DATABASE || './data/expense-management.sqlite',
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    synchronize: true,
    logging: false,
  });

  try {
    console.log('📦 Connecting to database...');
    await dataSource.initialize();
    console.log('✅ Database connected');

    await seedExpenseReports(dataSource);

    console.log('✅ All seeds completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
    console.log('👋 Database connection closed');
  }
}

runSeed();
