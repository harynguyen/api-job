import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './models/entities/job.entity';
import { Repository } from 'typeorm';
import { CreateJobDto } from './models/dto/create-job.dto';
import { Company } from 'src/company/models/entities/company.entity';
import { Equal } from 'typeorm';
import { FilterDto } from './models/dto/filter.dto';
import { ILike } from "typeorm";
import { UpdateJobStatusDto } from './models/dto/update-job-status.dto';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job) private jobRepository: Repository<Job>,
    @InjectRepository(Company) private companyRepository: Repository<Company>,
  ) { }

  async createJob(createJobDto: CreateJobDto): Promise<Job> {
    const { company_id, job_requirement_tech, job_location, ...jobData } = createJobDto;
    const existingJob = await this.jobRepository.findOne({
      where: [{ job_name: createJobDto.job_name }],
    });

    if (existingJob) {
      return existingJob;
    }

    const company = await this.companyRepository.findOne({
      where: [{ company_id: company_id }],
    });

    if (!company) {
      throw new Error(`Company with ID ${company_id} not found`);
    }

    // Save job requirement technologies
    const formattedJobRequirementTech = Array.isArray(job_requirement_tech) ? job_requirement_tech.map(tech => tech.value).join(', ') : job_requirement_tech;
    const formattedJobLocation = Array.isArray(job_location) ? job_location.map(location => location.value).join(', ') : job_location;

    const job = this.jobRepository.create({
      ...jobData,
      company: company,
      job_requirement_tech: formattedJobRequirementTech,
      job_location: formattedJobLocation,
    });

    await job.save();
    return job;
  }


  async getAllJobPublished(filterDto: FilterDto): Promise<Job[]> {
    const { search_word, job_location, job_salary_range } = filterDto;
    if (search_word === "" && job_location === "default" && job_salary_range === "default") {
      // Case 1: No search word, default location, and default salary range
      const jobs = await this.jobRepository.find({ where: { job_status: 'Approved' }, relations: ['company'] });
      return jobs;
    } else if (search_word !== "" && job_location === "default" && job_salary_range === "default") {
      // Case 2: Search word provided, default location, and default salary range
      const jobs = await this.jobRepository.find({ where: { job_status: 'Approved', job_name: ILike(`%${search_word}%`) }, relations: ['company'] });
      if (jobs === null || jobs.length === 0) {
        const jobsDes = await this.jobRepository.find({ where: { job_status: 'Approved', job_description: ILike(`%${search_word}%`) }, relations: ['company'] });
        return jobsDes;
      }
      return jobs;
    } else if (search_word === "" && job_location !== "default" && job_salary_range === "default") {
      // Case 3: No search word, custom location, and default salary range
      const jobs = await this.jobRepository.find({ where: { job_status: 'Approved', job_location: ILike(`%${job_location}%`) }, relations: ['company'] });
      return jobs;
    } else if (search_word === "" && job_location === "default" && job_salary_range !== "default") {
      // Case 4: No search word, default location, and custom salary range
      const jobs = await this.jobRepository.find({ where: { job_status: 'Approved', job_salary_range: job_salary_range }, relations: ['company'] });
      return jobs;
    } else if (search_word !== "" && job_location !== "default" && job_salary_range === "default") {
      // Case 5: Search word provided, custom location, and default salary range
      const jobs = await this.jobRepository.find({ where: { job_status: 'Approved', job_name: ILike(`%${search_word}%`), job_location: ILike(`%${job_location}%`) }, relations: ['company'] });
      if (jobs === null || jobs.length === 0) {
        const jobsDes = await this.jobRepository.find({ where: { job_status: 'Approved', job_description: ILike(`%${search_word}%`), job_location: ILike(`%${job_location}%`) }, relations: ['company'] });
        return jobsDes;
      }
      return jobs;
    } else if (search_word !== "" && job_location === "default" && job_salary_range !== "default") {
      // Case 6: Search word provided, default location, and custom salary range
      const jobs = await this.jobRepository.find({ where: { job_status: 'Approved', job_name: ILike(`%${search_word}%`), job_salary_range: job_salary_range }, relations: ['company'] });
      if (jobs === null || jobs.length === 0) {
        const jobsDes = await this.jobRepository.find({ where: { job_status: 'Approved', job_description: ILike(`%${search_word}%`), job_salary_range: job_salary_range }, relations: ['company'] });
        return jobsDes;
      }
      return jobs;
    } else if (search_word === "" && job_location !== "default" && job_salary_range !== "default") {
      // Case 7: No search word, custom location, and custom salary range
      const jobs = await this.jobRepository.find({ where: { job_status: 'Approved', job_location: ILike(`%${job_location}%`), job_salary_range: job_salary_range }, relations: ['company'] });
      return jobs;
    } else {
      // Case 8: All parameters provided
      const jobs = await this.jobRepository.find({ where: { job_status: 'Approved', job_name: ILike(`%${search_word}%`), job_location: ILike(`%${job_location}%`), job_salary_range: job_salary_range }, relations: ['company'] });
      if (jobs === null || jobs.length === 0) {
        const jobsDes = await this.jobRepository.find({ where: { job_status: 'Approved', job_description: ILike(`%${search_word}%`), job_location: ILike(`%${job_location}%`), job_salary_range: job_salary_range }, relations: ['company'] });
        return jobsDes;
      }
      return jobs;
    }
  }

  async getAllJobViaCompanyId(companyId: string, userId: string): Promise<Job[]> {
    if (companyId === "default") {
      const jobs = await this.jobRepository.createQueryBuilder('job')
        .innerJoinAndSelect('job.company', 'company')
        .where('company.user_id = :userId', { userId })
        .getMany();
      return jobs;
    } else {
      const Job = await this.jobRepository.find({
        where: { company: Equal(companyId) },
        relations: ['company']
      });
      return Job;
    }
  }

  async getAllJob(): Promise<Job[]> {
    const jobs = await this.jobRepository.createQueryBuilder('job')
      .innerJoinAndSelect('job.company', 'company')
      .select(['job', 'company.company_name'])
      .getMany();
    return jobs;
  }

  async deleteJob(jobId: string): Promise<void> {
    try {
      const jobToRemove = await this.jobRepository.findOne({
        where: { job_id: jobId }
      });
      if (!jobToRemove) {
        throw new Error('Job not found');
      }
      await this.jobRepository.remove(jobToRemove);
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  }

  async updateJob(createJobDto: CreateJobDto): Promise<Job> {
    const { job_id, company_id, job_requirement_tech, job_location, ...jobData } = createJobDto;

    // Find the existing job
    const existingJob = await this.jobRepository.findOne({
      where: { job_id: job_id }
    });

    if (!existingJob) {
      throw new NotFoundException(`Job with ID ${job_id} not found`);
    }

    // Update the company if provided
    if (company_id) {
      const company = await this.companyRepository.findOne({
        where: { company_id: company_id }
      });

      if (!company) {
        throw new NotFoundException(`Company with ID ${company_id} not found`);
      }
      existingJob.company = company;
    }

    // Update job data
    if (job_requirement_tech) {
      existingJob.job_requirement_tech = Array.isArray(job_requirement_tech) ? job_requirement_tech.map(tech => tech.value).join(', ') : job_requirement_tech;
    }

    if (job_location) {
      existingJob.job_location = Array.isArray(job_location) ? job_location.map(location => location.value).join(', ') : job_location;
    }

    // Update other job properties
    Object.assign(existingJob, jobData);

    // Save the updated job
    await this.jobRepository.save(existingJob);

    return existingJob;
  }
  async updateJobStatus(updateJobStatusDto: UpdateJobStatusDto): Promise<Job> {
    const { job_id, job_status } = updateJobStatusDto;

    const existingJob = await this.jobRepository.findOne({
      where: { job_id: job_id }
    });

    if (!existingJob) {
      throw new Error(`Job with ID ${job_id} not found`);
    }
    const updatedJob = this.jobRepository.merge(existingJob, { job_status });

    await this.jobRepository.save(updatedJob);

    return updatedJob;
  }

  async getJobViaId(jobId: string):Promise<Job>{
    const job = await this.jobRepository.findOne({where: {job_id: jobId}, relations: ['company']});
    return job;
  }

  async getJobStatistics(): Promise<{ approved: number; total: number }> {
    const approvedJobsCount = await this.jobRepository.count({ where: { job_status: 'Approved' } });
    const totalJobsCount = await this.jobRepository.count();
    return { approved: approvedJobsCount, total: totalJobsCount };
  }
  
}
