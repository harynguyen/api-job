import { Controller, Post, Body, Get, Param, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './models/dto/create-cv.dto';
import { Cv } from './models/entities/cv.entity';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';

@ApiTags('Cv')
@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) { }

  @Post('createCv')
  @UseInterceptors(FileInterceptor('CvFile'))
  async createCv(
    @Body() createCvDto: CreateCvDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<Cv> {
    const uploadFolder = 'src/cv/uploads';
    const filename = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadFolder, filename);

    fs.writeFileSync(filePath, file.buffer);

    createCvDto.cv_fileName = filename;

    return this.cvService.createCv(createCvDto);
  }

  @Get('getAllCv')
  async getAllCv(): Promise<Cv[]> {
    return this.cvService.getAllCv();
  }

  @Get('getCvViaUserId/:user_id')
  async getCvViaUserId(@Param('user_id') user_id: string): Promise<Cv[]> {
    return this.cvService.getCvViaUserId(user_id);
  }

  @Get('getAllJobAppliedViaUserId/:user_id')
  async getAllJobAppliedViaUserId(@Param('user_id') user_id: string): Promise<Cv[]> {
    return this.cvService.getAllJobAppliedViaUserId(user_id);
  }
  
  @Get('getAllCvByJobId/:job_id')
  async getAllCvByJobId(@Param('job_id') job_id: string): Promise<Cv[]> {
    return this.cvService.getAllCvByJobId(job_id);
  }

  @Get('getFile/:filename')
  getFile(@Param('filename') filename: string, @Res() res: Response): void {
    const filePath = this.cvService.getFilePath(filename);
    res.download(filePath, filename); // This will initiate the file download
  }
}
