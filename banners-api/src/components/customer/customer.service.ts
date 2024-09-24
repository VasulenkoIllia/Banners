import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from '../../entities/customer.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';

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

  async findAllCustomers(queryParams: Record<string, any> = {}): Promise<any> {
    const params: FindOptionsWhere<CustomerEntity> = {};

    if (queryParams.search) {
      params.name = Like(`%${queryParams.search}%`);
    }

    const [customers, count] = await this.customerRepository.findAndCount({
      skip: +queryParams.skip || 0,
      take: +queryParams.take || 20,
      where: params,
    });

    return {
      customers,
      total: count,
    };
  }

  async removeCustomer(id: number) {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    return await this.customerRepository.delete(id);
  }
}
