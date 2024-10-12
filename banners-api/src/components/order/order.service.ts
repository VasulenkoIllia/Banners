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
    const { customerId, ...orderData } = createDto;
    const productIds = [];
    console.log(orderData);

    orderData.products.forEach((product) => {
      productIds.push(product.productId);

      product.costPrice = parseFloat(product.costPrice) || 0;
      product.salePrice = parseFloat(product.salePrice) || 0;
    });

    if (!Array.isArray(productIds) || productIds.length === 0) {
      throw new Error('Invalid product IDs. Expected an array of product IDs.');
    }

    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with id ${customerId} not found`);
    }

    const products = await this.productRepository.find({
      where: { id: In(productIds) },
      relations: ['productMaterials'],
    });

    if (!products || products.length === 0) {
      throw new NotFoundException('No products found for the provided IDs');
    }
    const newOrder = this.orderRepository.create({
      ...orderData,
      customer,
      products,
    }) as unknown as OrderEntity;

    const savedOrder = await this.orderRepository.save(newOrder);

    await this.adjustMaterialQuantities(savedOrder, 'decrease');

    return savedOrder;
  }

  async findAllOrders(
    queryParams: any,
  ): Promise<{ orders: OrderEntity[]; total: number }> {
    const skip = queryParams.skip || 0;
    const take = queryParams.take || 20;

    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.products', 'products')
      .skip(skip)
      .take(take);

    if (queryParams.customer) {
      queryBuilder.andWhere('customer.name ILIKE :customerName', {
        customerName: `%${queryParams.customer}%`,
      });
    }

    if (queryParams.sortField && queryParams.sortOrder) {
      const sortOrder = queryParams.sortOrder.toUpperCase();

      if (queryParams.sortField === 'customer') {
        queryBuilder.orderBy('customer.name', sortOrder);
      } else if (queryParams.sortField === 'completionDate') {
        queryBuilder.orderBy('order.completionDate', sortOrder);
      } else {
        queryBuilder.orderBy(`order.${queryParams.sortField}`, sortOrder);
      }
    }

    const [orders, total] = await queryBuilder.getManyAndCount();

    return {
      orders,
      total,
    };
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
    const { customerId, productIds, status, ...orderData } = updateDto;

    if (customerId) {
      const customer = await this.customerRepository.findOne({
        where: { id: customerId },
      });
      if (!customer) {
        throw new NotFoundException(`Customer with id ${customerId} not found`);
      }
      order.customer = customer;
    }

    if (productIds) {
      const products = await this.productRepository.find({
        where: { id: In(productIds) },
        relations: ['productMaterials'],
      });
      if (!products || products.length === 0) {
        throw new NotFoundException('No products found for the provided IDs');
      }
      order.products = products;
    }

    if (status && status !== order.status) {
      if (
        status === OrderStatus.ORDERED &&
        order.status !== OrderStatus.ORDERED
      ) {
        console.log(`Decreasing materials for order: ${order.id}`);
        await this.adjustMaterialQuantities(order, 'decrease');
      } else if (status === OrderStatus.CANCELLATION) {
        console.log(`Increasing materials for order: ${order.id}`);
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
      if (!Array.isArray(product.productMaterials)) {
        throw new Error(
          `ProductMaterials for product ${product.id} is not an array or is undefined`,
        );
      }

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
        console.log(quantityToAdjust);

        if (isNaN(quantityToAdjust)) {
          throw new Error(
            `Invalid quantity for productMaterial ${productMaterial.id}: ${productMaterial.quantity}`,
          );
        }

        if (action === 'decrease') {
          const materialQuantity = +material.quantity;
          material.quantity = materialQuantity - +quantityToAdjust;
          if (material.quantity < 0) {
            throw new Error(
              `Insufficient stock for material: ${material.name}`,
            );
          }
        } else if (action === 'increase') {
          const materialQuantity = +material.quantity;
          material.quantity = +quantityToAdjust + materialQuantity;
        }

        await this.materialRepository.save(material);
      }
    }
  }
}
