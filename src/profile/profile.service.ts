import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './models/entities/profile.entity';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './models/dto/update-profile.dto';
import { User } from 'src/users/models/entities/user.entity';
import { Equal } from 'typeorm';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) { }

  async createProfile(user: User): Promise<Profile> {
    const profile = new Profile();
    profile.user = user;
    await profile.save();
    return profile;
  }

  async updateProfile(updateProfileDto: UpdateProfileDto): Promise<Profile> {
    const { profile_id, first_name, last_name, dob, phone_number, avatar } = updateProfileDto;

    let existingProfile = await this.profileRepository.findOne({
      where: { profile_id },
    });

    if (!existingProfile) {
      throw new NotFoundException('Profile not found');
    }

    existingProfile.first_name = first_name;
    existingProfile.last_name = last_name;
    existingProfile.dob = dob;
    existingProfile.phone_number = phone_number;
    existingProfile.avatar = avatar;

    await this.profileRepository.save(existingProfile);

    return existingProfile;
  }

  async getProfileByUserId(userId: string): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { user: Equal(userId) },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  async getImageData(imageName: string): Promise<string | null> {
    const imagePath = join(__dirname, '..', '..', '..', 'Backend', 'src', 'profile', 'uploads', imageName);

    return new Promise((resolve, reject) => {
      fs.readFile(imagePath, (err, data) => {
        if (err) {
          if (err.code === 'ENOENT') {
            resolve(null);
          } else {
            reject(err);
          }
        } else {
          const base64Image = Buffer.from(data).toString('base64');
          const imageUrl = `data:image/jpeg;base64,${base64Image}`;
          resolve(imageUrl);
        }
      });
    });
  }

}
