import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cv } from './models/entities/cv.entity';
import { Repository } from 'typeorm';
import { CreateCvDto } from './models/dto/create-cv.dto';
import { User } from 'src/users/models/entities/user.entity';
import { Job } from 'src/jobs/models/entities/job.entity';
import * as path from 'path';

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(Cv) private cvRepository: Repository<Cv>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Job) private jobRepository: Repository<Job>,
  ) { }

  async createCv(createCvDto: CreateCvDto): Promise<Cv> {
    const { job_id, user_id } = createCvDto;
    const existingCv = await this.cvRepository.findOne({
      where: { job: { job_id: job_id }, user: { user_id: user_id } },
      relations: ['job', 'user'],
    });

    if (existingCv) {
      Object.assign(existingCv, createCvDto);
      return this.cvRepository.save(existingCv);
    }

    const job = await this.jobRepository.findOne({ where: { job_id: job_id } });
    const user = await this.userRepository.findOne({ where: { user_id: user_id } });

    // Check if job and user exist
    if (!job || !user) {
      throw new NotFoundException('Job or User not found');
    }

    const cv = this.cvRepository.create(createCvDto);
    cv.job = job;
    cv.user = user;
    return this.cvRepository.save(cv);
  }

  async getAllCv(): Promise<Cv[]> {
    return this.cvRepository.find();
  }

  async getCvViaUserId(user_id: string): Promise<Cv[]> {
    const cv = await this.cvRepository.find({
      where: { user: { user_id: user_id } },
      relations: ['job', 'user']
    })
    return cv;
  }

  async getAllJobAppliedViaUserId(user_id: string): Promise<Cv[]> {
    const cv = await this.cvRepository.find({
      where: { user: { user_id: user_id } },
      relations: ['job', 'job.company', 'user']
    })
    return cv;
  }

  async getAllCvByJobId(job_id: string): Promise<Cv[]> {
    const cv = await this.cvRepository.find({
      where: { job: { job_id: job_id } },
      relations: ['job', 'job.company', 'user'],
    });
    return cv;
  }
  getFilePath(filename: string): string {
    // Assuming the files are stored in the 'uploads' directory
    const filePath = path.join(__dirname, '..', '..', '..', 'Backend', 'src', 'cv', 'uploads', filename);
    return filePath;
  }
}
