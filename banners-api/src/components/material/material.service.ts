import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MaterialEntity } from '../../entities/material.entity';
import { FindOptionsWhere, Like, MoreThan, Repository } from 'typeorm';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(MaterialEntity)
    private readonly materialRepository: Repository<MaterialEntity>,
  ) {}

  async createMaterial(createDto: any) {
    return this.materialRepository.save(
      this.materialRepository.create({ ...createDto }),
    );
  }

  async findOneMaterial(id: number) {
    return await this.materialRepository.findOne({
      where: { id },
    });
  }

  async updateMaterial(id: number, updateDto: any) {
    const material = await this.materialRepository.findOne({ where: { id } });
    if (!material) {
      throw new NotFoundException(`Material with id ${id} not found`);
    }

    return this.materialRepository.save({ ...material, ...updateDto });
  }

  async findAllMaterials(queryParams: Record<string, any> = {}): Promise<any> {
    const params: FindOptionsWhere<MaterialEntity> = {};

    if (queryParams.search) {
      params.name = Like(`%${queryParams.search}%`);
    }

    if (queryParams.minPrice) {
      params.pricePerUnit = MoreThan(+queryParams.minPrice);
    }

    const [materials, count] = await this.materialRepository.findAndCount({
      skip: +queryParams.skip || 0,
      take: +queryParams.take || 20,
      where: params,
    });

    return {
      materials,
      total: count,
    };
  }

  async removeMaterial(id: number) {
    const material = await this.materialRepository.findOne({ where: { id } });
    if (!material) {
      throw new NotFoundException(`Material with id ${id} not found`);
    }
    return await this.materialRepository.delete(id);
  }
}
