import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateStatusDto {
  @IsNotEmpty()
  company_id: string;
  
  @IsNotEmpty()
  company_status: string;
}
