import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../../entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async createProduct(createDto: any) {
    const product = this.productRepository.create(createDto);
    return await this.productRepository.save(product);
  }

  async findAllProducts(queryParams: Record<string, any> = {}): Promise<any> {
    const [products, total] = await this.productRepository.findAndCount({
      skip: +queryParams.skip || 0,
      take: +queryParams.take || 20,
      where: {},
    });

    return { products, total };
  }

  async findOneProduct(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async updateProduct(id: number, updateDto: any) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return await this.productRepository.save({ ...product, ...updateDto });
  }

  async removeProduct(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    await this.productRepository.delete(id);
    return { message: 'Product successfully deleted' };
  }
}
