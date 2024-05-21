import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './models/entities/course.entity';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './models/dto/create-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course) private courseRepository: Repository<Course>,
  ) { }

  async createCourse(createCourseDto: CreateCourseDto): Promise<Course> {

    const existingCourse = await this.courseRepository.findOne({
      where: [{ course_name: createCourseDto.course_name }],
    });

    if (existingCourse) {
      return existingCourse;
    }

    const course = this.courseRepository.create(createCourseDto);
    await course.save();
    return course;
  }

  async updateCourse(createCourseDto: CreateCourseDto): Promise<Course> {

    const existingCourse = await this.courseRepository.findOne({
      where: [{ course_id: createCourseDto.course_id }],
    });

    if (!existingCourse) {
      throw new ConflictException("Course not found!!");
    }

    existingCourse.course_name = createCourseDto.course_name;
    existingCourse.course_start_time = createCourseDto.course_start_time;
    existingCourse.course_end_time = createCourseDto.course_end_time;

    await existingCourse.save();
    return existingCourse;
  }

  async getAllCourses(): Promise<Course[]> {
    return this.courseRepository.find();
  }

  async getCourseViaCourseId(course_id: string): Promise<Course> {
    return this.courseRepository.findOne({where: {course_id: course_id}});
  }
}
