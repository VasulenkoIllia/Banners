import { Controller, RequestMethod } from '@nestjs/common';
import { OrderService } from './order.service';
import { AdminEndpoint } from '../../common/decorators/admin-endpoint.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @AdminEndpoint('order/create', RequestMethod.POST)
  async createOrder(createDto: any) {
    const order = await this.orderService.createOrder(createDto);
    return {
      message: 'Order successfully created',
      order,
    };
  }

  @AdminEndpoint('order/:id', RequestMethod.GET)
  async findOneOrder(id: number) {
    const order = await this.orderService.findOneOrder(id);
    return order;
  }

  @AdminEndpoint('order/findAll', RequestMethod.GET)
  async findAllOrders(queryParams: Record<string, any> = {}) {
    const { orders, total } = await this.orderService.findAllOrders(
      queryParams,
    );
    return {
      orders,
      total,
    };
  }

  @AdminEndpoint('order/:id/update', RequestMethod.PUT)
  async updateOrder(id: number, updateDto: any) {
    const updatedOrder = await this.orderService.updateOrder(id, updateDto);
    return {
      message: 'Order successfully updated',
      updatedOrder,
    };
  }

  @AdminEndpoint('order/:id/delete', RequestMethod.DELETE)
  async removeOrder(id: number) {
    await this.orderService.removeOrder(id);
    return {
      message: 'Order successfully deleted',
    };
  }
}
