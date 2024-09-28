import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Req,
  RequestMethod,
} from '@nestjs/common';
import { AdminEndpoint } from '../../common/decorators/admin-endpoint.decorator';
import { ApiTags } from '@nestjs/swagger';
import { CustomerService } from './customer.service';
import { AppRequest } from '../../common/interfaces/app-request';

@ApiTags('Admin')
@Controller('admin')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @AdminEndpoint('customer/create', RequestMethod.POST)
  async createMaterial(@Body() createDto: any) {
    const customer = await this.customerService.createCustomer(createDto);
    return {
      message: 'Customer successfully created',
      customer,
    };
  }

  @AdminEndpoint('customer/findAll', RequestMethod.GET)
  findAllMaterials(@Req() req: AppRequest) {
    return this.customerService.findAllCustomers(req.query);
  }

  @AdminEndpoint('customer/:id', RequestMethod.GET)
  async findOneMaterial(@Param('id', ParseIntPipe) id: number) {
    return await this.customerService.findOneCustomer(id);
  }

  @AdminEndpoint('customer/:id/update', RequestMethod.PUT)
  async updateCustomer(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: any,
  ) {
    const updatedCustomer = await this.customerService.updateCustomer(
      id,
      updateDto,
    );
    return {
      message: 'Customer successfully updated',
      updatedCustomer,
    };
  }

  @AdminEndpoint('customer/:id/delete', RequestMethod.DELETE)
  async removeMaterial(@Param('id', ParseIntPipe) id: number) {
    await this.customerService.removeCustomer(id);
    return {
      message: 'Customer successfully deleted',
    };
  }
}
