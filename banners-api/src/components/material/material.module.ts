import { Module } from '@nestjs/common';
import { MaterialController } from './material.controller';
import { MaterialService } from './material.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialEntity } from '../../entities/material.entity';

@Module({
  controllers: [MaterialController],
  providers: [MaterialService],
  imports: [TypeOrmModule.forFeature([MaterialEntity])],
})
export class MaterialModule {}
