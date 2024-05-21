import { Module } from '@nestjs/common';
import { CourseStudentService } from './courseStudent.service';
import { CourseStudentController } from './courseStudent.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseStudent } from './models/entities/courseStudent.entity';
import { Course } from 'src/course/models/entities/course.entity';
import { User } from 'src/users/models/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { CourseModule } from 'src/course/course.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourseStudent, Course, User]),
    UsersModule,
    CourseModule
  ],
  controllers: [CourseStudentController],
  providers: [CourseStudentService],
  exports: [CourseStudentService],
})
export class CourseStudentModule {}
