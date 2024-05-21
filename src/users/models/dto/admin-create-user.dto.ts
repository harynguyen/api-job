import { IsNotEmpty } from 'class-validator';

export class AdminCreateUserDto {

  @IsNotEmpty()
  user_id: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  role_id: string;
}
