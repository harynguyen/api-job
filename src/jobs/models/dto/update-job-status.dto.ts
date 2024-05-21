import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateJobStatusDto {
  @IsNotEmpty()
  job_id: string;
  
  @IsNotEmpty()
  job_status: string;
}
