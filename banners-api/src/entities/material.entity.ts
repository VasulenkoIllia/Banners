import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AutoMap } from '@automapper/classes';
import { MeasurementUnit } from '../common/interfaces/Measurement/MeasurementUnit.enum';
import { ProductMaterialEntity } from './product_material.entity';

@Entity('material')
export class MaterialEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column({ type: 'varchar', length: 300 })
  @AutoMap()
  public name: string;

  @Column({
    type: 'enum',
    enum: MeasurementUnit,
    default: MeasurementUnit.PIECES,
  })
  public measurementUnit: MeasurementUnit;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  public pricePerUnit: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  public quantity: number;

  @OneToMany(
    () => ProductMaterialEntity,
    (productMaterial) => productMaterial.material,
  )
  public productMaterials: ProductMaterialEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;
}
