import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from '../../entities/customer.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}

  async createCustomer(createDto: any) {
    return this.customerRepository.save(
      this.customerRepository.create({ ...createDto }),
    );
  }

  async findAllCustomers(queryParams: Record<string, any> = {}): Promise<any> {
    const searchCondition = queryParams.search
      ? [
          { name: ILike(`%${queryParams.search}%`) },
          { phone: ILike(`%${queryParams.search}%`) },
          { instagram: ILike(`%${queryParams.search}%`) },
        ]
      : [];

    const [customers, total] = await this.customerRepository.findAndCount({
      where: searchCondition.length > 0 ? searchCondition : {},
      skip: +queryParams.skip || 0,
      take: +queryParams.take || 20,
    });

    return {
      customers,
      total,
    };
  }

  async findOneCustomer(id: number) {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    return customer;
  }

  async updateCustomer(id: number, updateDto: any) {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    return this.customerRepository.save({ ...customer, ...updateDto });
  }

  async removeCustomer(id: number) {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    return await this.customerRepository.delete(id);
  }
}
