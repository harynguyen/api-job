import { IsNotEmpty } from 'class-validator';

export class CreateCourseDto {

  @IsNotEmpty()
  course_id: string;

  @IsNotEmpty()
  course_name: string;

  @IsNotEmpty()
  course_start_time: Date;

  @IsNotEmpty()
  course_end_time: Date;
  
}
