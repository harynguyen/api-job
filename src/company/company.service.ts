import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './models/entities/company.entity';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './models/dto/create-company.dto';
import { Equal } from 'typeorm';
import { User } from 'src/users/models/entities/user.entity';
import * as fs from 'fs';
import { join } from 'path';
import { UpdateStatusDto } from './models/dto/update-status.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company) private companyRepository: Repository<Company>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) { }

  async createCompany(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const { company_name, user_id, ...companyData } = createCompanyDto;

    const existingCompany = await this.companyRepository.findOne({
      where: [{ company_name: company_name }],
    });

    if (existingCompany) {
      return existingCompany;
    }

    const user = await this.userRepository.findOne({
      where: [{ user_id: user_id }],
    });
    if (!user) {
      throw new Error(`User with ID ${user_id} not found`);
    }

    const company = this.companyRepository.create({
      ...companyData,
      company_name: company_name,
      user: user,
    });

    await company.save();
    return company;
  }

  async updateCompany(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const { company_id, user_id, ...companyData } = createCompanyDto;

    const existingCompany = await this.companyRepository.findOne({
      where: [{ company_id: company_id }],
    });

    if (!existingCompany) {
      throw new Error(`Company with ID ${company_id} not found`);
    }

    this.companyRepository.merge(existingCompany, companyData);

    const updatedCompany = await this.companyRepository.save(existingCompany);

    return updatedCompany;
  }

  async getAllCompanyNonUser(): Promise<Company[]> {
    return await this.companyRepository.find();
  }

  async getAllCompany(userId: string): Promise<Company[]> {
    return await this.companyRepository.find({ where: { company_status: 'Approved', user: Equal(userId) } });
  }

  async getAllCompanyManage(userId: string): Promise<Company[]> {
    return await this.companyRepository.find({ where: { user: Equal(userId) } });
  }

  async getImageData(imageName: string): Promise<string | null> {
    const imagePath = join(__dirname, '..', '..', '..', 'Backend', 'src', 'company', 'uploads', imageName);

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

  async deleteCompany(companyId: string): Promise<void> {
    try {
      const companyToRemove = await this.companyRepository.findOne({
        where: { company_id: companyId }
      });
      if (!companyToRemove) {
        throw new Error('Company not found');
      }
      await this.companyRepository.remove(companyToRemove);
    } catch (error) {
      console.error('Error deleting company:', error);
      throw error;
    }
  }

  async updateCompanyStatus(updateCompanyStatus: UpdateStatusDto): Promise<Company> {
    const { company_id, company_status } = updateCompanyStatus;

    // Check if the company exists in the database
    const existingCompany = await this.companyRepository.findOne({ 
      where: { company_id: company_id } 
    });

    if (!existingCompany) {
      throw new Error(`Company with ID ${company_id} not found`);
    }
    const updatedCompany = this.companyRepository.merge(existingCompany, { company_status });

    await this.companyRepository.save(updatedCompany);

    return updatedCompany;
  }
  async getCompanyStatistics(): Promise<{ approved: number; total: number }> {
    const approvedCompaniesCount = await this.companyRepository.count({ where: { company_status: 'Approved' } });
    const totalCompaniesCount = await this.companyRepository.count();
    return { approved: approvedCompaniesCount, total: totalCompaniesCount };
  }
}
