import { Controller, NotFoundException, RequestMethod } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MaterialEntity } from '../../entities/material.entity';
import { FindOptionsWhere, Like, MoreThan, Repository } from 'typeorm';
import { AdminEndpoint } from '../../common/decorators/admin-endpoint.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class MaterialController {
  constructor(
    @InjectRepository(MaterialEntity)
    private readonly materialRepository: Repository<MaterialEntity>,
  ) {}

  @AdminEndpoint('material/create', RequestMethod.POST)
  async createMaterial(createDto: any) {
    const material = await this.materialRepository.save(
      this.materialRepository.create({ ...createDto }),
    );
    return {
      message: 'Material successfully created',
      material,
    };
  }

  @AdminEndpoint('material/:id', RequestMethod.GET)
  async findOneMaterial(id: number) {
    const material = await this.materialRepository.findOne({
      where: { id },
    });
    if (!material) {
      throw new NotFoundException(`Material with id ${id} not found`);
    }
    return material;
  }

  @AdminEndpoint('material/:id/update', RequestMethod.PUT)
  async updateMaterial(id: number, updateDto: any) {
    const material = await this.materialRepository.findOne({ where: { id } });
    if (!material) {
      throw new NotFoundException(`Material with id ${id} not found`);
    }

    const updatedMaterial = await this.materialRepository.save({
      ...material,
      ...updateDto,
    });

    return {
      message: 'Material successfully updated',
      updatedMaterial,
    };
  }

  @AdminEndpoint('material/findAll', RequestMethod.GET)
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

  @AdminEndpoint('material/:id/delete', RequestMethod.DELETE)
  async removeMaterial(id: number) {
    const material = await this.materialRepository.findOne({ where: { id } });
    if (!material) {
      throw new NotFoundException(`Material with id ${id} not found`);
    }
    await this.materialRepository.delete(id);
    return {
      message: 'Material successfully deleted',
    };
  }
}
