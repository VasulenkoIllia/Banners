import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductEntity } from '../../entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductMaterialEntity } from '../../entities/product_material.entity';
import { MaterialEntity } from '../../entities/material.entity';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductMaterialEntity,
      MaterialEntity,
    ]),
  ],
})
export class ProductModule {}
