import { IsNotEmpty } from 'class-validator';

interface JobRequirementTech {
  value: string;
  label: string;
}

interface JobLocation {
  value: string;
  label: string;
}

export class CreateJobDto {
  
  @IsNotEmpty()
  job_id: string;

  @IsNotEmpty()
  job_name: string;

  @IsNotEmpty()
  job_number_require: number;

  @IsNotEmpty()
  job_description: string;

  @IsNotEmpty()
  job_requirement_tech: JobRequirementTech[];

  @IsNotEmpty()
  job_location: JobLocation[];

  @IsNotEmpty()
  job_salary_range: string;

  @IsNotEmpty()
  job_level: string;

  @IsNotEmpty()
  job_type: string;

  @IsNotEmpty()
  job_experience: string;

  @IsNotEmpty()
  job_status: string;

  @IsNotEmpty()
  job_submit_date: Date;

  @IsNotEmpty()
  job_expired: Date;

  @IsNotEmpty()
  company_id: string;
}
