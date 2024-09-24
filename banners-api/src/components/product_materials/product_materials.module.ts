import { Module } from '@nestjs/common';
import { ProductMaterialController } from './product_materials.controller';
import { ProductMaterialService } from './product_materials.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductMaterialEntity } from '../../entities/product_material.entity';

@Module({
  controllers: [ProductMaterialController],
  providers: [ProductMaterialService],
  imports: [TypeOrmModule.forFeature([ProductMaterialEntity])],
})
export class ProductMaterialsModule {}
