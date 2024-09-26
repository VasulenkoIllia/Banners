import { Module } from '@nestjs/common';
import { MaterialController } from './material.controller';
import { MaterialService } from './material.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialEntity } from '../../entities/material.entity';
import { ProductService } from '../product/product.service';
import { ProductEntity } from '../../entities/product.entity';
import { ProductMaterialEntity } from '../../entities/product_material.entity';

@Module({
  controllers: [MaterialController],
  providers: [MaterialService, ProductService],
  imports: [
    TypeOrmModule.forFeature([
      MaterialEntity,
      ProductEntity,
      ProductMaterialEntity,
      MaterialEntity,
    ]),
  ],
})
export class MaterialModule {}
