import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateProfileDto {
  @IsNotEmpty()
  profile_id: string;

  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  dob: string;

  @IsOptional()
  avatar: string;

  @IsNotEmpty()
  phone_number: string;
}