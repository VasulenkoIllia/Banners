import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductEntity } from './product.entity';
import { OrderStatus } from '../common/interfaces/Order/OrderStatus.enum';
import { CustomerEntity } from './customer.entity';

@Entity('order')
export class OrderEntity {
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.ORDERED,
  })
  public status: OrderStatus;

  @Column({ type: 'varchar', length: 500 })
  public description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  public costPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  public salePrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  public profit: number;

  @Column({ type: 'varchar', length: 255 })
  public address: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public country: string;

  @CreateDateColumn({ type: 'timestamp' })
  public startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  public completionDate: Date;

  @ManyToMany(() => ProductEntity, { cascade: true })
  @JoinTable({
    name: 'order_products',
    joinColumn: { name: 'order_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' },
  })
  public products: ProductEntity[];

  @ManyToOne(() => CustomerEntity, (customer) => customer.orders, {
    cascade: true,
    eager: true,
  })
  public customer: CustomerEntity;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  public calculateOrderPrices(): void {
    this.costPrice = this.products.reduce((total, product) => {
      const productCostPrice = parseFloat(String(product.costPrice)) || 0;
      return total + productCostPrice;
    }, 0);
    //
    // this.salePrice = this.products.reduce((total, product) => {
    //   const productSalePrice = parseFloat(String(product.salePrice)) || 0;
    //   return total + productSalePrice;
    // }, 0);

    this.profit = this.salePrice - this.costPrice;
  }
}
