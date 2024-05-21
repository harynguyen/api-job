import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseStudent } from './models/entities/courseStudent.entity';
import { Repository } from 'typeorm';
import { CreateCourseStudentDto } from './models/dto/create-course-student.dto';
import { Equal } from 'typeorm';
import { User } from 'src/users/models/entities/user.entity';
import { Course } from 'src/course/models/entities/course.entity';

@Injectable()
export class CourseStudentService {
  constructor(
    @InjectRepository(CourseStudent) private courseStudentRepository: Repository<CourseStudent>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Course) private courseRepository: Repository<Course>,
  ) { }

  async createCourseStudent(createCourseStudentDto: CreateCourseStudentDto): Promise<CourseStudent> {
    const { course_id, user_id } = createCourseStudentDto;
    const existingEnroll = await this.courseStudentRepository.findOne({
      where: { course: { course_id: course_id }, user: { user_id: user_id } },
      relations: ['course', 'user'],
    });

    if (existingEnroll) {
      throw new ConflictException("You already enroll in this course!!!");
    }

    const course = await this.courseRepository.findOne({ where: { course_id: course_id } });
    const user = await this.userRepository.findOne({ where: { user_id: user_id } });

    // Check if job and user exist
    if (!course || !user) {
      throw new NotFoundException('Course or User not found');
    }

    const courseStudent = this.courseStudentRepository.create(createCourseStudentDto);
    courseStudent.course = course;
    courseStudent.user = user;
    return this.courseStudentRepository.save(courseStudent);
  }

  async getAllCourseStudent(): Promise<CourseStudent[]> {
    return this.courseStudentRepository.find();
  }

  async getAllStudentInCourse(course_id: string): Promise<CourseStudent[]> {
    const courseStudents = await this.courseStudentRepository
      .createQueryBuilder('cs')
      .innerJoin('cs.course', 'c')
      .innerJoin('cs.user', 'u')
      .innerJoin('profile', 'p', 'p.user_id = u.user_id')
      .select([
        'cs.course_student_id',
        'c.course_id',
        'c.course_name',
        'c.course_start_time',
        'c.course_end_time',
        'u.user_id',
        'u.email',
        'p.first_name',
        'p.last_name'
      ])
      .where('c.course_id = :course_id', { course_id })
      .getRawMany();

    return courseStudents;
  }


  async removeStudentFromCourse(courseStudent_id: string): Promise<void> {
    try {
      const courseStudentToRemove = await this.courseStudentRepository.findOne({
        where: { course_student_id: courseStudent_id }
      });
      if (!courseStudentToRemove) {
        throw new Error('Course student not found');
      }
      await this.courseStudentRepository.remove(courseStudentToRemove);
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  }
  async getCourseStatistics(): Promise<{ approved: number; total: number }> {
    try {
      const totalCourses = await this.courseRepository.count();
      const coursesWithUser = await this.courseStudentRepository.count();
      return { approved: coursesWithUser, total: totalCourses };
    } catch (error) {
      console.error('Error fetching course statistics:', error);
      throw error;
    }
  }
}
