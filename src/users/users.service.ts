import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './models/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './models/dto/create-user.dto';
import { RoleService } from 'src/role/role.service';
import { Role } from 'src/role/models/entities/role.entity';
import { ProfileService } from 'src/profile/profile.service';
import { Equal } from 'typeorm';
import { UpdateRoleUserDto } from './models/dto/update-role-user.dto';
import { AdminCreateUserDto } from './models/dto/admin-create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    private readonly roleService: RoleService,
    private readonly profileService: ProfileService,
  ) { }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, roleName } = createUserDto;
    const existingUser = await this.usersRepository.findOne({
      where: [{ email }],
    });

    if (existingUser) {
      throw new ConflictException('user already exists');
    }

    const roleObj = await this.roleService.getRoleByName(roleName);
    const roleId = roleObj.role_id;
    const role = await this.roleRepository.findOne({
      where: { role_id: roleId },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const user = this.usersRepository.create({
      ...createUserDto,
      role: role
    });

    await this.profileService.createProfile(user);
    await user.save();
    return user;
  }

  async login(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;
    const existingUser = await this.usersRepository.findOne({
      where: [{ email }],
    });

    if (existingUser) {
      if (existingUser.password === password) {
        return existingUser;
      } else {
        throw new ConflictException("Wrong password");
      }
    } else {
      throw new ConflictException("User not found");
    }
  }

  async getRoleByUserId(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { user_id: Equal(userId) },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getAllUsersWithRoles(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['role'] });
  }

  async updateUser(updateRoleUserDto: UpdateRoleUserDto): Promise<User> {
    const { user_id, role_name, password } = updateRoleUserDto;
    const user = await this.usersRepository.findOne({
      where: { user_id: user_id },
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Find the role by roleName
    const role = await this.roleRepository.findOne({ where: { role_name: role_name } });

    if (!role) {
      throw new NotFoundException('Role not found');
    }


    // Assign the found role's role_id to the user
    user.role = role;
    user.password = password;

    // Save the updated user entity
    await this.usersRepository.save(user);

    return user;
  }

  async adminRegister(adminCreateUserDto: AdminCreateUserDto): Promise<User> {
    const { email, role_id } = adminCreateUserDto;

    const existingUser = await this.usersRepository.findOne({
      where: [{ email }],
    });

    if (existingUser) {
      return existingUser;
    }

    const role = await this.roleRepository.findOne({
      where: { role_id: role_id },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const user = this.usersRepository.create({
      ...adminCreateUserDto,
      role: role
    });

    await this.profileService.createProfile(user);

    await user.save();

    return user;
  }

  async deleteUser(user_id: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: [{ user_id: user_id }],
    });
    if (!user) {
      throw new NotFoundException('Contribution not found');
    }
    await this.usersRepository.remove(user);
  }

}