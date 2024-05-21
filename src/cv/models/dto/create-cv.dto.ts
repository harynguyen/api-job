import { IsNotEmpty } from 'class-validator';

export class CreateCvDto {
  @IsNotEmpty()
  cv_id: string;

  @IsNotEmpty()
  job_id: string;

  @IsNotEmpty()
  cv_fileName: string;

  @IsNotEmpty()
  cv_description: string;

  @IsNotEmpty()
  user_id: string;
}
