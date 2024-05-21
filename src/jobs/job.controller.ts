import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './models/dto/create-job.dto';
import { Job } from './models/entities/job.entity';
import { ApiTags } from '@nestjs/swagger';
import { FilterDto } from './models/dto/filter.dto';
import { UpdateJobStatusDto } from './models/dto/update-job-status.dto';

@ApiTags('Job')
@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) { }

  @Post('createJob')
  createJob(@Body() createJobDto: CreateJobDto): Promise<Job> {
    return this.jobService.createJob(createJobDto);
  }

  @Post('getAllJobPublished')
  getAllJobPublished(@Body() filterDto: FilterDto): Promise<Job[]> {
    return this.jobService.getAllJobPublished(filterDto);
  }

  @Get('getAllJobViaCompanyId/:companyId/:userId')
  async getAllJobViaCompanyId(@Param('companyId') companyId: string, @Param('userId') userId: string): Promise<Job[]> {
    return this.jobService.getAllJobViaCompanyId(companyId, userId);
  }

  @Get('getJobViaId/:jobId')
  getJobViaId(@Param('jobId') jobId: string): Promise<Job> {
    return this.jobService.getJobViaId(jobId);
  }

  @Get('getAllJob')
  async getAllJob(): Promise<Job[]> {
    return this.jobService.getAllJob();
  }

  @Delete('deleteJob/:jobId')
  deleteJob(@Param('jobId') jobId: string): Promise<void> {
    return this.jobService.deleteJob(jobId);
  }

  @Post('updateJob')
  updateJob(@Body() createJobDto: CreateJobDto): Promise<Job> {
    return this.jobService.updateJob(createJobDto);
  }

  @Post('updateJobStatus')
  updateJobStatus(@Body() updateJobStatusDto: UpdateJobStatusDto): Promise<Job> {
    return this.jobService.updateJobStatus(updateJobStatusDto);
  }
  
  @Get('jobStatistics')
  async getJobStatistics(): Promise<{ approved: number; total: number }> {
    return this.jobService.getJobStatistics();
  }
}
