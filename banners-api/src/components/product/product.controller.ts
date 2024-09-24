import { Controller, RequestMethod } from '@nestjs/common';
import { ProductService } from './product.service';
import { AdminEndpoint } from '../../common/decorators/admin-endpoint.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @AdminEndpoint('product/create', RequestMethod.POST)
  async createProduct(createDto: any) {
    const product = await this.productService.createProduct(createDto);
    return {
      message: 'Product successfully created',
      product,
    };
  }

  @AdminEndpoint('product/:id', RequestMethod.GET)
  async findOneProduct(id: number) {
    const product = await this.productService.findOneProduct(id);
    return product;
  }

  @AdminEndpoint('product/findAll', RequestMethod.GET)
  async findAllProducts(queryParams: Record<string, any> = {}) {
    const { products, total } = await this.productService.findAllProducts(
      queryParams,
    );
    return {
      products,
      total,
    };
  }

  @AdminEndpoint('product/:id/update', RequestMethod.PUT)
  async updateProduct(id: number, updateDto: any) {
    const updatedProduct = await this.productService.updateProduct(
      id,
      updateDto,
    );
    return {
      message: 'Product successfully updated',
      updatedProduct,
    };
  }

  @AdminEndpoint('product/:id/delete', RequestMethod.DELETE)
  async removeProduct(id: number) {
    await this.productService.removeProduct(id);
    return {
      message: 'Product successfully deleted',
    };
  }
}
