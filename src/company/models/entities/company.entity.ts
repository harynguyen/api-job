import { User } from 'src/users/models/entities/user.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm';

@Entity()
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  company_id: string;

  @Column()
  company_name: string;

  @Column()
  company_address: string;

  @Column()
  company_size: string;

  @Column()
  company_country: string;

  @Column()
  company_work_date_range: string;

  @Column()
  company_description: string;

  @Column()
  company_logo_name: string;

  @Column({ default: 'Pending' })
  company_status: string;

  @ManyToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
