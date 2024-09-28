import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ProductEntity } from '../../entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '../../entities/order.entity';
import { MaterialEntity } from '../../entities/material.entity';
import { CustomerEntity } from '../../entities/customer.entity';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      ProductEntity,
      MaterialEntity,
      CustomerEntity,
    ]),
  ],
})
export class OrderModule {}
