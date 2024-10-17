import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { OrderEntity } from '../../entities/order.entity';
import { ProductEntity } from '../../entities/product.entity';
import { CustomerEntity } from '../../entities/customer.entity';
import { MaterialEntity } from '../../entities/material.entity';
import { OrderStatus } from '../../common/interfaces/Order/OrderStatus.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
    @InjectRepository(MaterialEntity)
    private readonly materialRepository: Repository<MaterialEntity>,
  ) {}

  async createOrder(createDto: any) {
    const { customerId, products, ...orderData } = createDto;

    if (!Array.isArray(products) || products.length === 0) {
      throw new Error('Invalid product list.');
    }

    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with id ${customerId} not found`);
    }

    const productEntities = await this.productRepository.find({
      where: { id: In(products.map((p) => p.productId)) },
    });

    if (!productEntities.length) {
      throw new NotFoundException('No products found for the provided IDs');
    }

    const newOrder = this.orderRepository.create({
      ...orderData,
      customer,
      products: productEntities,
    }) as unknown as OrderEntity;

    const savedOrder = await this.orderRepository.save(newOrder);
    await this.adjustMaterialQuantities(savedOrder, 'decrease');
    return savedOrder;
  }

  async findAllOrders(
    queryParams: any,
  ): Promise<{ orders: OrderEntity[]; total: number }> {
    const {
      startDate,
      endDate,
      skip = 0,
      take = 20,
      sortField,
      sortOrder,
      customer,
    } = queryParams;
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.products', 'products')
      .skip(skip)
      .take(take);

    if (startDate && endDate) {
      queryBuilder.andWhere('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    }

    if (customer) {
      queryBuilder.andWhere('customer.name ILIKE :customerName', {
        customerName: `%${customer}%`,
      });
    }

    if (sortField && sortOrder) {
      queryBuilder.orderBy(`order.${sortField}`, sortOrder.toUpperCase());
    } else {
      queryBuilder.orderBy('order.createdAt', 'ASC');
    }

    const [orders, total] = await queryBuilder.getManyAndCount();
    return { orders, total };
  }

  async findOneOrder(id: number): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['customer', 'products'],
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return order;
  }

  async updateOrder(id: number, updateDto: any): Promise<OrderEntity> {
    const order = await this.findOneOrder(id);
    const { customerId, products, status, ...orderData } = updateDto;

    if (customerId) {
      const customer = await this.customerRepository.findOne({
        where: { id: customerId },
      });
      if (!customer) {
        throw new NotFoundException(`Customer with id ${customerId} not found`);
      }
      order.customer = customer;
    }

    if (products) {
      const productEntities = await this.productRepository.find({
        where: { id: In(products.map((p) => p.productId)) },
      });
      if (!productEntities.length) {
        throw new NotFoundException('No products found for the provided IDs');
      }
      order.products = productEntities;
    }

    if (status && status !== order.status) {
      if (
        status === OrderStatus.COMPLETED &&
        order.status !== OrderStatus.COMPLETED
      ) {
        await this.adjustMaterialQuantities(order, 'decrease');
      } else if (status === OrderStatus.CANCELLATION) {
        await this.adjustMaterialQuantities(order, 'increase');
      }
      order.status = status;
    }

    Object.assign(order, orderData);
    return await this.orderRepository.save(order);
  }

  async removeOrder(id: number): Promise<void> {
    const order = await this.findOneOrder(id);
    if (order.status !== OrderStatus.CANCELLATION) {
      await this.adjustMaterialQuantities(order, 'increase');
    }
    await this.orderRepository.remove(order);
  }

  private async adjustMaterialQuantities(
    order: OrderEntity,
    action: 'decrease' | 'increase',
  ) {
    const productIds = order.products.map((product) => product.id);

    const products = await this.productRepository.find({
      where: { id: In(productIds) },
      relations: ['productMaterials', 'productMaterials.material'],
    });

    for (const product of products) {
      for (const productMaterial of product.productMaterials) {
        const material = await this.materialRepository.findOne({
          where: { id: productMaterial.material.id },
        });
        if (!material) {
          throw new NotFoundException(
            `Material with id ${productMaterial.material.id} not found`,
          );
        }

        const quantityToAdjust = parseFloat(String(productMaterial.quantity));
        if (isNaN(quantityToAdjust)) {
          throw new Error(
            `Invalid quantity for productMaterial ${productMaterial.id}: ${productMaterial.quantity}`,
          );
        }

        if (action === 'decrease') {
          material.quantity -= quantityToAdjust;
          if (material.quantity < 0) {
            throw new Error(
              `Insufficient stock for material: ${material.name}`,
            );
          }
        } else {
          material.quantity += quantityToAdjust;
        }

        await this.materialRepository.save(material);
      }
    }
  }
}
