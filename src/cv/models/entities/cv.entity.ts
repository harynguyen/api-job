import { Job } from 'src/jobs/models/entities/job.entity';
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
export class Cv extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  cv_id: string;

  @ManyToOne(() => Job, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_id' }) 
  job: Job;

  @Column()
  cv_fileName: string;

  @Column()
  cv_description: string;
  
  @ManyToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) 
  user: User;

}