import { IsNotEmpty } from 'class-validator';

export class CreateCourseStudentDto {
  @IsNotEmpty()
  course_student_id: string;
  
  @IsNotEmpty()
  course_id: string;

  @IsNotEmpty()
  user_id: string;
}
