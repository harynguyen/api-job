import { Controller, Post, Body, Param, Get, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './models/dto/create-company.dto';
import { Company } from './models/entities/company.entity';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';
import { UpdateStatusDto } from './models/dto/update-status.dto';

@ApiTags('Company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) { }

  @Post('createCompany')
  @UseInterceptors(FileInterceptor('imageFile'))
  async createCompany(
    @Body() createCompanyDto: CreateCompanyDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<Company> {
    const uploadFolder = 'src/company/uploads';
    const filename = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadFolder, filename);

    fs.writeFileSync(filePath, file.buffer);

    createCompanyDto.company_logo_name = filename;

    return this.companyService.createCompany(createCompanyDto);
  }

  @Post('updateCompany')
  @UseInterceptors(FileInterceptor('imageFile'))
  async updateCompany(
    @Body() createCompanyDto: CreateCompanyDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<Company> {
    if (file) {
      const uploadFolder = 'src/company/uploads';
      const filename = `${Date.now()}-${file.originalname}`;
      const filePath = path.join(uploadFolder, filename);

      fs.writeFileSync(filePath, file.buffer);

      createCompanyDto.company_logo_name = filename;
    }

    return this.companyService.updateCompany(createCompanyDto);
  }

  @Get('getAllCompany/:userId')
  getAllCompany(@Param('userId') userId: string): Promise<Company[]> {
    return this.companyService.getAllCompany(userId);
  }

  @Get('getAllCompanyNonUser')
  getAllCompanyNonUser(): Promise<Company[]> {
    return this.companyService.getAllCompanyNonUser();
  }

  @Get('getAllCompanyManage/:userId')
  getAllCompanyManage(@Param('userId') userId: string): Promise<Company[]> {
    return this.companyService.getAllCompanyManage(userId);
  }

  @Get('getImage/:imageName')
  async serveImage(@Param('imageName') imageName: string): Promise<string | null> {
    return this.companyService.getImageData(imageName);
  }

  @Delete('deleteCompany/:companyId')
  deleteCompany(@Param('companyId') companyId: string): Promise<void> {
    return this.companyService.deleteCompany(companyId);
  }

  @Post('updateCompanyStatus')
  updateCompanyStatus(@Body() updateStatusDto: UpdateStatusDto): Promise<Company> {
    return this.companyService.updateCompanyStatus(updateStatusDto);
  }
  @Get('companyStatistics')
  async getCompanyStatistics(): Promise<{ approved: number; total: number }> {
    return this.companyService.getCompanyStatistics();
  }
}

