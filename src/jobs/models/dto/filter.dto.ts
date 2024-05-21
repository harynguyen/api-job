import { IsNotEmpty, IsOptional } from 'class-validator';

export class FilterDto {

  @IsOptional()
  search_word: string;

  @IsNotEmpty()
  job_location: string;

  @IsNotEmpty()
  job_salary_range: string;
}
