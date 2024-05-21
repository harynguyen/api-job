import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './models/dto/create-course.dto';
import { Course } from './models/entities/course.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Course')
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post('createCourse')
  createCourse(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    return this.courseService.createCourse(createCourseDto);
  }

  @Post('updateCourse')
  updateCourse(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    return this.courseService.updateCourse(createCourseDto);
  }

  @Get('getAllCourses')
  async getAllCourses(): Promise<Course[]> {
    return this.courseService.getAllCourses();
  }

  @Get('getCourseViaCourseId/:course_id')
  async getCourseViaCourseId(@Param('course_id') course_id: string): Promise<Course> {
    return this.courseService.getCourseViaCourseId(course_id);
  }

}
