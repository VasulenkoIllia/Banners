import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { ExpenseEntity } from '../../entities/expense.entity';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(ExpenseEntity)
    private readonly expenseRepository: Repository<ExpenseEntity>,
  ) {}

  async createExpense(createDto: any) {
    const expense = this.expenseRepository.create(createDto);
    return await this.expenseRepository.save(expense);
  }

  async findOneExpense(id: number) {
    const expense = await this.expenseRepository.findOne({ where: { id } });
    if (!expense) {
      throw new NotFoundException(`Expense with id ${id} not found`);
    }
    return expense;
  }

  async removeExpense(id: number) {
    const expense = await this.expenseRepository.findOne({ where: { id } });
    if (!expense) {
      throw new NotFoundException(`Expense with id ${id} not found`);
    }
    await this.expenseRepository.delete(id);
    return { message: 'expense successfully deleted' };
  }

  async findAllExpenses(queryParams: Record<string, any> = {}): Promise<any> {
    const params: FindOptionsWhere<ExpenseEntity> = {};

    // Implement search functionality on the name field
    if (queryParams.search) {
      params.name = ILike(`%${queryParams.search}%`);
    }

    const skip = queryParams.skip ? parseInt(queryParams.skip, 10) : 0;
    const take = queryParams.take ? parseInt(queryParams.take, 10) : 20;

    const order = queryParams.sortField
      ? { [queryParams.sortField]: queryParams.sortOrder || 'ASC' }
      : {};

    const [expenses, total] = await this.expenseRepository.findAndCount({
      skip,
      take,
      where: params,
      order,
    });

    return {
      expenses,
      total,
    };
  }
}
