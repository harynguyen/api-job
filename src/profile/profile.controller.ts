import { Controller, Post, Body, Get, Param, NotFoundException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './models/dto/update-profile.dto';
import { Profile } from './models/entities/profile.entity';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';


@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Get('getProfileByUserId/:userId')
  async getProfileByUserId(@Param('userId') userId: string): Promise<Profile> {
    const profile = await this.profileService.getProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  @Post('updateProfile')
  @UseInterceptors(FileInterceptor('imageFile', {
    storage: diskStorage({
      destination: 'src/profile/uploads',
      filename: (req, file, cb) => {
        const filename = `${Date.now()}-${file.originalname}`;
        return cb(null, filename);
      },
    }),
  }))
  async updateProfile(
    @UploadedFile() file: Express.Multer.File,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    if (file) {
      updateProfileDto.avatar = file.filename;
    }
    return this.profileService.updateProfile(updateProfileDto);
  }

  @Get('getImage/:imageName')
  async serveImage(@Param('imageName') imageName: string): Promise<string | null> {
    return this.profileService.getImageData(imageName);
  }
}