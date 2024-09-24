import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { OrderEntity } from '../../entities/order.entity';
import { ProductEntity } from '../../entities/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async createOrder(createDto: any) {
    const products = await this.productRepository.find({
      where: { id: In(createDto.productIds) },
    });

    if (products.length !== createDto.productIds.length) {
      throw new NotFoundException('One or more products not found');
    }

    const order = this.orderRepository.create({ ...createDto, products });
    return this.orderRepository.save(order);
  }

  async findAllOrders(queryParams: Record<string, any> = {}): Promise<any> {
    const [orders, total] = await this.orderRepository.findAndCount({
      skip: +queryParams.skip || 0,
      take: +queryParams.take || 20,
      where: {},
      relations: ['products', 'customer'],
    });
    return { orders, total };
  }

  async findOneOrder(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['products', 'customer'],
    });
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return order;
  }

  async updateOrder(id: number, updateDto: any) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['products', 'customer'],
    });
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    const updatedOrder = await this.orderRepository.save({
      ...order,
      ...updateDto,
    });
    return updatedOrder;
  }

  async removeOrder(id: number) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    await this.orderRepository.delete(id);
    return { message: 'Order successfully deleted' };
  }
}
