import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Req,
  RequestMethod,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { AdminEndpoint } from '../../common/decorators/admin-endpoint.decorator';
import { ApiTags } from '@nestjs/swagger';
import { AppRequest } from '../../common/interfaces/app-request';

@ApiTags('Admin')
@Controller('admin')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @AdminEndpoint('order/create', RequestMethod.POST)
  async createMaterial(@Body() createDto: any) {
    const order = await this.orderService.createOrder(createDto);
    return {
      message: 'Material successfully created',
      order,
    };
  }

  @AdminEndpoint('order/findAll', RequestMethod.GET)
  findAllOrders(@Req() req: AppRequest) {
    return this.orderService.findAllOrders(req.query);
  }

  @AdminEndpoint('order/:id', RequestMethod.GET)
  async findOneOrder(@Param('id', ParseIntPipe) id: number) {
    return await this.orderService.findOneOrder(id);
  }

  @AdminEndpoint('order/:id/update', RequestMethod.PUT)
  async updateOrder(@Param('id', ParseIntPipe) id: number, updateDto: any) {
    const updatedOrder = await this.orderService.updateOrder(id, updateDto);
    return {
      message: 'Order successfully updated',
      updatedOrder,
    };
  }

  @AdminEndpoint('order/:id/delete', RequestMethod.DELETE)
  async removeMaterial(@Param('id', ParseIntPipe) id: number) {
    await this.orderService.removeOrder(id);
    return {
      message: 'Order successfully deleted',
    };
  }
}
