import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductMaterialEntity } from '../../entities/product_material.entity';

@Injectable()
export class ProductMaterialService {
  constructor(
    @InjectRepository(ProductMaterialEntity)
    private readonly productMaterialRepository: Repository<ProductMaterialEntity>,
  ) {}

  async createProductMaterial(createDto: any) {
    const productMaterial = this.productMaterialRepository.create(createDto);
    return await this.productMaterialRepository.save(productMaterial);
  }

  async findOneProductMaterial(id: number) {
    const productMaterial = await this.productMaterialRepository.findOne({
      where: { id },
    });
    if (!productMaterial) {
      throw new NotFoundException(`ProductMaterial with id ${id} not found`);
    }
    return productMaterial;
  }

  async findAllProductMaterials(queryParams: Record<string, any> = {}) {
    const skip = queryParams.skip || 0;
    const take = queryParams.take || 20;

    const [productMaterials, total] =
      await this.productMaterialRepository.findAndCount({
        skip: +skip,
        take: +take,
      });

    return {
      productMaterials,
      total,
    };
  }

  async updateProductMaterial(id: number, updateDto: any) {
    const productMaterial = await this.productMaterialRepository.findOne({
      where: { id },
    });
    if (!productMaterial) {
      throw new NotFoundException(`ProductMaterial with id ${id} not found`);
    }

    Object.assign(productMaterial, updateDto);
    return await this.productMaterialRepository.save(productMaterial);
  }

  async removeProductMaterial(id: number) {
    const productMaterial = await this.productMaterialRepository.findOne({
      where: { id },
    });
    if (!productMaterial) {
      throw new NotFoundException(`ProductMaterial with id ${id} not found`);
    }

    await this.productMaterialRepository.delete(id);
    return {
      message: `ProductMaterial with id ${id} successfully deleted`,
    };
  }
}
