import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MaterialEntity } from '../../entities/material.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(MaterialEntity)
    private readonly materialRepository: Repository<MaterialEntity>,
  ) {}

  async findAllMaterials(queryParams: Record<string, any> = {}): Promise<any> {
    const params: FindOptionsWhere<MaterialEntity> = {};

    if (queryParams.search) {
      params.name = Like(`%${queryParams.search}%`);
    }

    if (queryParams.measurementUnit) {
      params.measurementUnit = queryParams.measurementUnit;
    }

    const skip = queryParams.skip ? parseInt(queryParams.skip, 10) : 0;
    const take = queryParams.take ? parseInt(queryParams.take, 10) : 20;

    const order = queryParams.sortField
      ? { [queryParams.sortField]: queryParams.sortOrder || 'ASC' }
      : {};

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
