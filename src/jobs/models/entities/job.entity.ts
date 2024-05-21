import { Company } from 'src/company/models/entities/company.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm';

@Entity()
export class Job extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  job_id: string;

  @Column()
  job_name: string;

  @Column()
  job_number_require: number;

  @Column()
  job_description: string;

  @Column()
  job_requirement_tech: string;

  @Column()
  job_location: string;

  @Column()
  job_salary_range: string;

  @Column()
  job_level: string;

  @Column()
  job_type: string;

  @Column()
  job_experience: string;

  @Column({ default: 'Pending' })
  job_status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  job_submit_date: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  job_expired: Date;

  @ManyToOne(() => Company, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;
}
