import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from '../../entities/order.entity';
import { ExpenseEntity } from '../../entities/expense.entity';
import { MaterialEntity } from '../../entities/material.entity';
import { StatisticsService } from './statistic.service';
import { StatisticController } from './statistic.сontroller';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity, ExpenseEntity, MaterialEntity]),
  ],
  controllers: [StatisticController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
