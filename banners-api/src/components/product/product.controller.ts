import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Req,
  RequestMethod,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiTags } from '@nestjs/swagger';
import { AdminEndpoint } from '../../common/decorators/admin-endpoint.decorator';
import { AppRequest } from '../../common/interfaces/app-request';

@ApiTags('Admin')
@Controller('admin')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @AdminEndpoint('product/create', RequestMethod.POST)
  async createProduct(@Body() createDto: any) {
    const material = await this.productService.createProduct(createDto);
    return {
      message: 'Product successfully created',
      material,
    };
  }

  @AdminEndpoint('product/findAll', RequestMethod.GET)
  findAllProducts(@Req() req: AppRequest) {
    return this.productService.findAllProducts(req.query);
  }

  @AdminEndpoint('product/:id', RequestMethod.GET)
  async findOneProduct(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.findOneProduct(id);
  }

  @AdminEndpoint('product/:id/update', RequestMethod.PUT)
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: any,
  ) {
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
  async removeProduct(@Param('id', ParseIntPipe) id: number) {
    await this.productService.removeProduct(id);
    return {
      message: 'Product successfully deleted',
    };
  }
}
