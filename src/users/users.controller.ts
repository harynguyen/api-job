import { Controller, Post, Body, Get, Param, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './models/dto/create-user.dto';
import { User } from './models/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { UpdateRoleUserDto } from './models/dto/update-role-user.dto';
import { AdminCreateUserDto } from './models/dto/admin-create-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('createUser')
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }
  
  @Post('login')
  login(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.login(createUserDto);
  }

  @Get('getRoleByUserId/:userId')
  async getRoleByUserId(@Param('userId') userId: string): Promise<User> {
    const user = await this.usersService.getRoleByUserId(userId);
    if (!user) {
      throw new NotFoundException('Role not found');
    }
    return user;
  }

  @Post('getAllUserWithRole')
  async getAllUsersWithRoles(): Promise<User[]> {
    return this.usersService.getAllUsersWithRoles();
  }
  
  @Post('updateUser')
  async updateUser(@Body() updateUserDto: UpdateRoleUserDto): Promise<User> {
    return this.usersService.updateUser(updateUserDto);
  }

  @Post('adminRegister')
  adminRegister(@Body() adminCreateUserDto: AdminCreateUserDto): Promise<User> {
    return this.usersService.adminRegister(adminCreateUserDto);
  }
  
  @Post('deleteUser/:user_id')
  async deleteUser(@Param('user_id') user_id: string): Promise<void> {
    return this.usersService.deleteUser(user_id);
  }

}
