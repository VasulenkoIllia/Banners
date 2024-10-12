import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity('customer')
export class CustomerEntity {
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column({ type: 'varchar', length: 255 })
  public name: string;

  @Column({ type: 'varchar', length: 255 })
  public address: string;

  @Column({ type: 'varchar', length: 15 })
  public phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public instagram: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public etsy: string;

  @OneToMany(() => OrderEntity, (order) => order.customer)
  public orders: OrderEntity[];

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt: Date;
}
