import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cv } from './models/entities/cv.entity';
import { Job } from 'src/jobs/models/entities/job.entity';
import { User } from 'src/users/models/entities/user.entity';
import { JobModule } from 'src/jobs/job.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cv, Job, User]),
    JobModule,
    UsersModule,
  ],
  controllers: [CvController],
  providers: [CvService],
  exports: [CvService],
})
export class CvModule {}
