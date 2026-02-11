import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { ExpenseReport } from '../../expense-reports/entities/expense-report.entity';
import { ExpenseStatus, ExpenseCategory } from '../../common/enums';

/**
 * Expense entity
 * Represents an individual expense within an expense report
 */
@Entity('expenses')
@Index(['reportId'])
@Index(['status'])
@Index(['expenseDate'])
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  reportId: string;

  @Column({ type: 'varchar' })
  category: ExpenseCategory;

  @Column({ type: 'varchar', nullable: true })
  expenseName: string | null;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  expenseDate: Date;

  @Column({ type: 'varchar' })
  status: ExpenseStatus;

  @ManyToOne(() => ExpenseReport, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reportId' })
  report: ExpenseReport;

  // Relation will be added when Attachment entity is created
  // @OneToMany(() => Attachment, attachment => attachment.expense, { cascade: true })
  // attachments: Attachment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
