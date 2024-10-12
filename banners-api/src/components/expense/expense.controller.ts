import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Req,
  RequestMethod,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppRequest } from '../../common/interfaces/app-request';
import { AdminEndpoint } from '../../common/decorators/admin-endpoint.decorator';
import { ExpenseService } from './expense.service';

@ApiTags('Admin')
@Controller('admin')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @AdminEndpoint('expense/create', RequestMethod.POST)
  async createExpense(@Body() createDto: any) {
    const material = await this.expenseService.createExpense(createDto);
    return {
      message: 'expense successfully created',
      material,
    };
  }

  @AdminEndpoint('expense/findAll', RequestMethod.GET)
  findAllExpenses(@Req() req: AppRequest) {
    return this.expenseService.findAllExpenses(req.query);
  }

  @AdminEndpoint('expense/:id', RequestMethod.GET)
  async findOneExpense(@Param('id', ParseIntPipe) id: number) {
    return await this.expenseService.findOneExpense(id);
  }

  @AdminEndpoint('expense/:id/delete', RequestMethod.DELETE)
  async removeExpense(@Param('id', ParseIntPipe) id: number) {
    await this.expenseService.removeExpense(id);
    return {
      message: 'expense successfully deleted',
    };
  }
}
