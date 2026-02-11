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
import { User } from '../../users/entities/user.entity';
import { ReportStatus } from '../../common/enums';

/**
 * ExpenseReport entity
 * Represents an expense report submitted by a user
 */
@Entity('expense_reports')
@Index(['userId'])
@Index(['status'])
@Index(['reportDate'])
export class ExpenseReport {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  purpose: string;

  @Column({ type: 'date' })
  reportDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ type: 'varchar' })
  status: ReportStatus;

  @Column({ type: 'date', nullable: true })
  paymentDate: Date | null;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // Relation will be added when Expense entity is created
  // @OneToMany(() => Expense, expense => expense.report, { cascade: true })
  // expenses: Expense[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
