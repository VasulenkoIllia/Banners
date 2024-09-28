import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, In, Repository } from 'typeorm';
import { ProductEntity } from '../../entities/product.entity';
import { ProductMaterialEntity } from '../../entities/product_material.entity';
import { MaterialEntity } from '../../entities/material.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductMaterialEntity)
    private readonly productMaterialRepository: Repository<ProductMaterialEntity>,
    @InjectRepository(MaterialEntity)
    private readonly materialRepository: Repository<MaterialEntity>,
  ) {}

  async createProduct(createDto: any) {
    const product = this.productRepository.create({
      name: createDto.name,
      description: createDto.description,
      salePrice: createDto.salePrice,
      costPrice: 0,
    });
    await this.productRepository.save(product);

    let totalCost = 0;

    for (const productMaterialDto of createDto.productMaterials) {
      const material = await this.materialRepository.findOne({
        where: { id: productMaterialDto.materialId },
      });

      if (!material) {
        throw new Error(
          `Material with id ${productMaterialDto.materialId} not found`,
        );
      }

      const quantity = productMaterialDto.quantity;
      const productMaterial = this.productMaterialRepository.create({
        material,
        product,
        quantity,
      });

      await this.productMaterialRepository.save(productMaterial);

      totalCost += Number(material.pricePerUnit) * Number(quantity);
    }

    product.costPrice = totalCost;
    await this.productRepository.save(product);

    return product;
  }

  async updateProductCostPricesForMaterial(materialId: number) {
    const productMaterials = await this.productMaterialRepository.find({
      where: { material: { id: materialId } },
      relations: ['product', 'material'],
    });

    for (const productMaterial of productMaterials) {
      const product = productMaterial.product;

      const productMaterialsForProduct =
        await this.productMaterialRepository.find({
          where: { product: { id: product.id } },
          relations: ['material'],
        });

      let newCostPrice = 0;
      for (const pm of productMaterialsForProduct) {
        newCostPrice += Number(pm.material.pricePerUnit) * Number(pm.quantity);
      }

      product.costPrice = newCostPrice;
      await this.productRepository.save(product);
    }
  }

  async findAllProducts(queryParams: Record<string, any> = {}): Promise<any> {
    const params: FindOptionsWhere<ProductEntity> = {};

    if (queryParams.name) {
      params.name = ILike(`%${queryParams.name}%`);
    }

    const skip = queryParams.skip ? parseInt(queryParams.skip, 10) : 0;
    const take = queryParams.take ? parseInt(queryParams.take, 10) : 20;

    const order = queryParams.sortField
      ? { [queryParams.sortField]: queryParams.sortOrder || 'ASC' }
      : {};

    const [products, total] = await this.productRepository.findAndCount({
      skip,
      take,
      where: params,
      order,
    });

    return { products, total };
  }

  async findOneProduct(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['productMaterials', 'productMaterials.material'],
    });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async updateProduct(id: number, updateDto: any) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        productMaterials: {
          product: true,
          material: true,
        },
      },
    });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    if (updateDto.removedMaterials && updateDto.removedMaterials.length > 0) {
      await this.productMaterialRepository.delete({
        product: { id: product.id },
        material: In(updateDto.removedMaterials),
      });

      product.productMaterials = product.productMaterials.filter(
        (pm) => !updateDto.removedMaterials.includes(pm.material.id),
      );
    }

    const existingProductMaterials = product.productMaterials;
    const newMaterials = [];

    for (const updatedMaterial of updateDto.productMaterials) {
      const existingMaterial = existingProductMaterials.find(
        (pm) => pm.material.id === updatedMaterial.materialId,
      );
      if (existingMaterial) {
        existingMaterial.quantity = updatedMaterial.quantity;
      } else {
        const newProductMaterial = await this.productMaterialRepository.save(
          this.productMaterialRepository.create({
            product: { id: product.id },
            material: { id: updatedMaterial.materialId },
            quantity: updatedMaterial.quantity,
          }),
        );

        newMaterials.push(newProductMaterial);
      }
    }

    if (newMaterials.length > 0) {
      await Promise.all(newMaterials);
    }
    if (existingProductMaterials.length > 0) {
      await this.productMaterialRepository.save(existingProductMaterials);
    }
    const productMaterials = await this.productMaterialRepository.find({
      where: {
        product: { id: product.id },
      },
      relations: {
        material: true,
      },
    });
    const totalCostPrice = productMaterials.reduce((sum, pm) => {
      return sum + pm.quantity * pm.material.pricePerUnit;
    }, 0);
    console.log(totalCostPrice);

    await this.productRepository.update(product.id, {
      name: updateDto.name,
      description: updateDto.description,
      costPrice: totalCostPrice,
    });
    return product;
  }

  async removeProduct(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['productMaterials'],
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    if (product.productMaterials.length > 0) {
      await this.productMaterialRepository.delete({ product: { id } });
    }

    await this.productRepository.delete(id);

    return { message: 'Product and associated materials successfully deleted' };
  }
}
