import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MaterialEntity } from './material.entity';
import { ProductEntity } from './product.entity';

@Entity('product_material')
export class ProductMaterialEntity {
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @ManyToOne(() => MaterialEntity, (material) => material.productMaterials, {
    onDelete: 'CASCADE',
  })
  public material: MaterialEntity;

  @ManyToOne(() => ProductEntity, (product) => product.productMaterials, {
    onDelete: 'CASCADE',
  })
  public product: ProductEntity;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  public quantity: number;
}
