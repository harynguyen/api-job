import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { CourseStudentService } from './courseStudent.service';
import { CreateCourseStudentDto } from './models/dto/create-course-student.dto';
import { CourseStudent } from './models/entities/courseStudent.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('CourseStudent')
@Controller('courseStudent')
export class CourseStudentController {
  constructor(private readonly courseStudentService: CourseStudentService) {}

  @Post('createCourseStudent')
  createCourseStudent(@Body() createCourseStudentDto: CreateCourseStudentDto): Promise<CourseStudent> {
    return this.courseStudentService.createCourseStudent(createCourseStudentDto);
  }

  @Get('getAllCourseStudent')
  async getAllCourseStudent(): Promise<CourseStudent[]> {
    return this.courseStudentService.getAllCourseStudent();
  }

  @Get('getAllStudentInCourse/:course_id')
  async getAllStudentInCourse(@Param('course_id') course_id: string): Promise<CourseStudent[]> {
    return this.courseStudentService.getAllStudentInCourse(course_id);
  }
  
  @Delete('removeStudentFromCourse/:courseStudent_id')
  removeStudentFromCourse(@Param('courseStudent_id') courseStudent_id: string): Promise<void> {
    return this.courseStudentService.removeStudentFromCourse(courseStudent_id);
  }
  @Get('courseStatistics')
  async getCourseStatistics(): Promise<{ approved: number; total: number }> {
    return this.courseStudentService.getCourseStatistics();
  }
}
