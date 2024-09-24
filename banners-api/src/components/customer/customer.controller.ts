import { Controller, NotFoundException, RequestMethod } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from '../../entities/customer.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { AdminEndpoint } from '../../common/decorators/admin-endpoint.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class CustomerController {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}

  @AdminEndpoint('customer/create', RequestMethod.POST)
  async createCustomer(createDto: any) {
    const customer = await this.customerRepository.save(
      this.customerRepository.create({ ...createDto }),
    );
    return {
      message: 'Customer successfully created',
      customer,
    };
  }

  @AdminEndpoint('customer/:id', RequestMethod.GET)
  async findOneCustomer(id: number) {
    const customer = await this.customerRepository.findOne({
      where: { id },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    return customer;
  }

  @AdminEndpoint('customer/:id/update', RequestMethod.PUT)
  async updateCustomer(id: number, updateDto: any) {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }

    const updatedCustomer = await this.customerRepository.save({
      ...customer,
      ...updateDto,
    });

    return {
      message: 'Customer successfully updated',
      updatedCustomer,
    };
  }

  @AdminEndpoint('customer/findAll', RequestMethod.GET)
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

  @AdminEndpoint('customer/:id/delete', RequestMethod.DELETE)
  async removeCustomer(id: number) {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    await this.customerRepository.delete(id);
    return {
      message: 'Customer successfully deleted',
    };
  }
}
