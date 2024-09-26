import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductMaterialEntity } from './product_material.entity';
import { OrderEntity } from './order.entity';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column({ type: 'varchar', length: 300 })
  public name: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  public description: string;

  @OneToMany(
    () => ProductMaterialEntity,
    (productMaterial) => productMaterial.product,
  )
  public productMaterials: ProductMaterialEntity[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  public costPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  public salePrice: number;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;

  @OneToMany(() => OrderEntity, (order) => order.products)
  public orders: OrderEntity[];
}
