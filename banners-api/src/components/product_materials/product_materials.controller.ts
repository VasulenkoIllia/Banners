import { Controller, RequestMethod } from '@nestjs/common';
import { AdminEndpoint } from '../../common/decorators/admin-endpoint.decorator';
import { ApiTags } from '@nestjs/swagger';
import { ProductMaterialService } from './product_materials.service';

@ApiTags('Admin')
@Controller('admin')
export class ProductMaterialController {
  constructor(
    private readonly productMaterialService: ProductMaterialService,
  ) {}

  @AdminEndpoint('product-material/create', RequestMethod.POST)
  async createProductMaterial(createDto: any) {
    const productMaterial =
      await this.productMaterialService.createProductMaterial(createDto);
    return {
      message: 'ProductMaterial successfully created',
      productMaterial,
    };
  }

  @AdminEndpoint('product-material/:id', RequestMethod.GET)
  async findOneProductMaterial(id: number) {
    return await this.productMaterialService.findOneProductMaterial(id);
  }

  @AdminEndpoint('product-material/findAll', RequestMethod.GET)
  async findAllProductMaterials(queryParams: Record<string, any> = {}) {
    const { productMaterials, total } =
      await this.productMaterialService.findAllProductMaterials(queryParams);
    return {
      productMaterials,
      total,
    };
  }

  @AdminEndpoint('product-material/:id/update', RequestMethod.PUT)
  async updateProductMaterial(id: number, updateDto: any) {
    const updatedProductMaterial =
      await this.productMaterialService.updateProductMaterial(id, updateDto);
    return {
      message: 'ProductMaterial successfully updated',
      updatedProductMaterial,
    };
  }

  @AdminEndpoint('product-material/:id/delete', RequestMethod.DELETE)
  async removeProductMaterial(id: number) {
    await this.productMaterialService.removeProductMaterial(id);
    return {
      message: 'ProductMaterial successfully deleted',
    };
  }
}
