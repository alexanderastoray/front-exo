import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { UserRole } from '../../common/enums';

/**
 * User entity
 * Represents a user in the system
 */
@Entity('users')
@Index(['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', default: UserRole.EMPLOYEE })
  role: UserRole;

  @Column({ type: 'uuid', nullable: true })
  managerId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations will be added when ExpenseReport entity is created
  // @OneToMany(() => ExpenseReport, report => report.user)
  // expenseReports: ExpenseReport[];
}
