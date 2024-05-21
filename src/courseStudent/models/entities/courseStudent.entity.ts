import { Course } from 'src/course/models/entities/course.entity';
import { User } from 'src/users/models/entities/user.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne
} from 'typeorm';

@Entity()
export class CourseStudent extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  course_student_id: string;

  @ManyToOne(() => Course, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @ManyToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
