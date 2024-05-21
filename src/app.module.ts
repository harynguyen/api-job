import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RoleModule } from './role/role.module';
import { ProfileModule } from './profile/profile.module';
import { JobModule } from './jobs/job.module';
import { CompanyModule } from './company/company.module';
import { CourseModule } from './course/course.module';
import { CourseStudentModule } from './courseStudent/courseStudent.module';
import { CvModule } from './cv/cv.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres', //process.env.DB_TYPE as any,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['dist/**/*.entity.js'],
      synchronize: true,
      ssl: true,
    }),
    UsersModule,
    RoleModule,
    ProfileModule,
    JobModule,
    CompanyModule,
    CourseModule,
    CourseStudentModule,
    CvModule,
    MailModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
