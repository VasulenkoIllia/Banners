import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, FindOptionsWhere, ILike, Repository } from 'typeorm';
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

  async findAllExpenses(
    queryParams: any,
  ): Promise<{ expenses: ExpenseEntity[]; total: number }> {
    const {
      startDate,
      endDate,
      search,
      skip = 0,
      take = 20,
      sortField,
      sortOrder,
    } = queryParams;
    const whereClause: FindOptionsWhere<ExpenseEntity> = {};

    if (startDate && endDate) {
      whereClause.createdAt = Between(new Date(startDate), new Date(endDate));
    }

    if (search) {
      whereClause.name = ILike(`%${search}%`);
    }

    const [expenses, total] = await this.expenseRepository.findAndCount({
      where: whereClause,
      skip,
      take,
      order: sortField
        ? { [sortField]: sortOrder || 'ASC' }
        : { createdAt: 'ASC' },
    });

    return { expenses, total };
  }

  async removeExpense(id: number) {
    const expense = await this.findOneExpense(id);
    if (!expense) {
      throw new NotFoundException(`Expense with id ${id} not found`);
    }
    await this.expenseRepository.remove(expense);
    return { message: 'Expense successfully deleted' };
  }
}
