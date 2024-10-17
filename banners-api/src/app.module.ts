import { Module } from '@nestjs/common';
import { UserModule } from './components/user/user.module';
import { AuthModule } from './components/auth/auth.module';
import { AppConfigInfrastructureModule } from './infrastructure/app-config/app-config.infrastructure.module';
import { DbInfrastructureModule } from './infrastructure/db/db.infrastructure.module';
import { MappingInfrastructureModule } from './infrastructure/mapping/mapping.infrastructure.module';
import { MaterialModule } from './components/material/material.module';
import { CustomerModule } from './components/customer/customer.module';
import { ProductModule } from './components/product/product.module';
import { OrderModule } from './components/order/order.module';
import { ProductMaterialsModule } from './components/product_materials/product_materials.module';
import { ExpenseModule } from './components/expense/expense.module';
import { StatisticsModule } from './components/statistic/statistic.module';

@Module({
  imports: [
    AppConfigInfrastructureModule,
    DbInfrastructureModule,
    MappingInfrastructureModule.registerProfilesAsync(),
    UserModule,
    AuthModule,
    MaterialModule,
    CustomerModule,
    ProductModule,
    OrderModule,
    ProductMaterialsModule,
    ExpenseModule,
    StatisticsModule,
  ],
})
export class AppModule {}
