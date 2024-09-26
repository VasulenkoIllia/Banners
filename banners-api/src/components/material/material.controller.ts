import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Req,
  RequestMethod,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MaterialService } from './material.service';
import { AppRequest } from '../../common/interfaces/app-request';
import { AdminEndpoint } from '../../common/decorators/admin-endpoint.decorator';

@ApiTags('Admin')
@Controller('admin')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @AdminEndpoint('material/create', RequestMethod.POST)
  async createMaterial(@Body() createDto: any) {
    const material = await this.materialService.createMaterial(createDto);
    return {
      message: 'Material successfully created',
      material,
    };
  }

  @AdminEndpoint('material/findAll', RequestMethod.GET)
  findAllMaterials(@Req() req: AppRequest) {
    return this.materialService.findAllMaterials(req.query);
  }

  @AdminEndpoint('material/:id', RequestMethod.GET)
  async findOneMaterial(@Param('id', ParseIntPipe) id: number) {
    return await this.materialService.findOneMaterial(id);
  }

  @AdminEndpoint('material/:id/addQuantity', RequestMethod.POST)
  async addMaterialQuantity(
    @Param('id', ParseIntPipe) id: number,
    @Body('quantity') quantity: number,
    @Body('pricePerUnit') pricePerUnit: number,
  ) {
    const updatedMaterial = await this.materialService.addMaterialQuantity(
      id,
      quantity,
      pricePerUnit,
    );
    return {
      message:
        'Material quantity successfully added and price updated if applicable',
      updatedMaterial,
    };
  }

  @AdminEndpoint('material/:id/update', RequestMethod.PUT)
  async updateMaterial(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: any,
  ) {
    const updatedMaterial = await this.materialService.updateMaterial(
      id,
      updateDto,
    );
    return {
      message: 'Material successfully updated',
      updatedMaterial,
    };
  }

  @AdminEndpoint('material/:id/delete', RequestMethod.DELETE)
  async removeMaterial(@Param('id', ParseIntPipe) id: number) {
    await this.materialService.removeMaterial(id);
    return {
      message: 'Material successfully deleted',
    };
  }
}
