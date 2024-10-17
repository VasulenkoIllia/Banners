import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOptionsOrder,
  FindOptionsWhere,
  ILike,
  Repository,
} from 'typeorm';
import { MaterialEntity } from '../../entities/material.entity';
import { ProductService } from '../product/product.service';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(MaterialEntity)
    private readonly materialRepository: Repository<MaterialEntity>,
    private readonly productService: ProductService,
  ) {}

  async createMaterial(createDto: any) {
    const material = this.materialRepository.create(createDto);
    return await this.materialRepository.save(material);
  }

  async findOneMaterial(id: number) {
    const material = await this.materialRepository.findOne({ where: { id } });
    if (!material) {
      throw new NotFoundException(`Material with id ${id} not found`);
    }
    return material;
  }

  async addMaterialQuantity(id: number, addQuantity: number, newPrice: number) {
    const material = await this.findOneMaterial(id);

    material.quantity = Number(material.quantity) + Number(addQuantity);

    let priceUpdated = false;
    if (newPrice > material.pricePerUnit) {
      material.pricePerUnit = newPrice;
      priceUpdated = true;
    }

    await this.materialRepository.save(material);

    if (priceUpdated) {
      await this.productService.updateProductCostPricesForMaterial(id);
    }

    return material;
  }

  async updateMaterial(id: number, updateDto: any) {
    const material = await this.findOneMaterial(id);
    if (!material) {
      throw new NotFoundException(`Material with id ${id} not found`);
    }
    return await this.materialRepository.save({ ...material, ...updateDto });
  }

  async removeMaterial(id: number) {
    const material = await this.findOneMaterial(id);
    if (!material) {
      throw new NotFoundException(`Material with id ${id} not found`);
    }
    await this.materialRepository.delete(id);
    return { message: 'Material successfully deleted' };
  }

  async findAllMaterials(queryParams: Record<string, any> = {}): Promise<any> {
    const params: FindOptionsWhere<MaterialEntity> = {};

    if (queryParams.search) {
      params.name = ILike(`%${queryParams.search}%`);
    }

    if (queryParams.measurementUnit) {
      params.measurementUnit = queryParams.measurementUnit;
    }

    if (queryParams.startDate && queryParams.endDate) {
      params.createdAt = Between(
        new Date(queryParams.startDate),
        new Date(queryParams.endDate),
      );
    }

    const skip = queryParams.skip ? parseInt(queryParams.skip, 10) : 0;
    const take = queryParams.take ? parseInt(queryParams.take, 10) : 20;

    const order: FindOptionsOrder<MaterialEntity> = queryParams.sortField
      ? { [queryParams.sortField]: queryParams.sortOrder as 'ASC' | 'DESC' }
      : { createdAt: 'ASC' };

    const [materials, total] = await this.materialRepository.findAndCount({
      skip,
      take,
      where: params,
      order,
    });

    return {
      materials,
      total,
    };
  }
}
