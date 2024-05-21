import { User } from 'src/users/models/entities/user.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Column,
} from 'typeorm';

@Entity()
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  profile_id: string;

  @Column({default: ''}) 
  first_name: string;

  @Column({default: ''}) 
  last_name: string;

  @Column({default: ''}) 
  dob: string;

  @Column({default: ''}) 
  phone_number: string;

  @Column({default: ''}) 
  avatar: string;

  @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) 
  user: User;

  toJSON() {
    const { user, ...rest } = this;
    return rest;
  }

}
