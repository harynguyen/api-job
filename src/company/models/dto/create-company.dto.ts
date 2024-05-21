import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty()
  company_id: string;
  
  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  company_name: string;

  @IsNotEmpty()
  company_address: string;

  @IsNotEmpty()
  company_size: string;

  @IsNotEmpty()
  company_country: string;

  @IsNotEmpty()
  company_work_date_range: string;

  @IsNotEmpty()
  company_description: string;

  @IsOptional()
  company_logo_name: string;
  
  @IsNotEmpty()
  company_status: string;
}
