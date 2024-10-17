import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { OrderEntity } from '../../entities/order.entity';
import { ExpenseEntity } from '../../entities/expense.entity';
import { MaterialEntity } from '../../entities/material.entity';
import { OrderStatus } from '../../common/interfaces/Order/OrderStatus.enum';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(ExpenseEntity)
    private readonly expenseRepository: Repository<ExpenseEntity>,
    @InjectRepository(MaterialEntity)
    private readonly materialRepository: Repository<MaterialEntity>,
  ) {}

  async getStatistics(queryParams: {
    startDate?: string;
    endDate?: string;
    sortField?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<any> {
    const { startDate, endDate, sortField, sortOrder } = queryParams;
    const whereClause: any = {};

    if (startDate && endDate) {
      whereClause.createdAt = Between(new Date(startDate), new Date(endDate));
    }

    // Отримуємо замовлення зі статусом 'COMPLETED'
    const completedOrders = await this.orderRepository.find({
      where: {
        status: OrderStatus.COMPLETED,
        ...whereClause,
      },
      order: sortField ? { [sortField]: sortOrder } : { createdAt: 'ASC' },
    });

    // Отримуємо всі замовлення незалежно від статусу
    const allOrders = await this.orderRepository.find({
      where: whereClause,
      order: sortField ? { [sortField]: sortOrder } : { createdAt: 'ASC' },
    });

    // Підрахунок кількості замовлень по статусах
    const [orderedOrders, inProgressOrders, cancelledOrders] =
      await Promise.all([
        this.orderRepository.count({
          where: { status: OrderStatus.ORDERED, ...whereClause },
        }),
        this.orderRepository.count({
          where: { status: OrderStatus.IN_PROGRESS, ...whereClause },
        }),
        this.orderRepository.count({
          where: { status: OrderStatus.CANCELLATION, ...whereClause },
        }),
      ]);

    // Підрахунок кількості замовлень за країнами
    const [ordersFromUA, ordersFromEU] = await Promise.all([
      this.orderRepository.count({
        where: { country: 'UA', ...whereClause },
      }),
      this.orderRepository.count({
        where: { country: 'EU', ...whereClause },
      }),
    ]);

    // Загальна кількість замовлень
    const totalOrders = allOrders.length;
    const totalCompletedOrders = completedOrders.length;

    // Отримуємо витрати
    const expenses = await this.expenseRepository.find({
      where: whereClause,
      order: sortField ? { [sortField]: sortOrder } : { createdAt: 'ASC' },
    });

    // Отримуємо матеріали
    const materials = await this.materialRepository.find({
      where: whereClause,
      order: sortField ? { [sortField]: sortOrder } : { createdAt: 'ASC' },
    });

    // Обчислення загального прибутку
    const totalProfit = completedOrders.reduce(
      (sum, order) => sum + Number(order.profit),
      0,
    );

    // Обчислення загальних витрат
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0,
    );

    // Чистий прибуток
    const netProfit = totalProfit - totalExpenses;

    // Деталізована статистика замовлень
    const totalOrderCostPrice = completedOrders.reduce(
      (sum, order) => sum + Number(order.costPrice),
      0,
    );
    const totalOrderSalePrice = completedOrders.reduce(
      (sum, order) => sum + Number(order.salePrice),
      0,
    );

    // Деталізована статистика матеріалів
    const totalMaterialQuantity = materials.reduce(
      (sum, material) => sum + Number(material.quantity),
      0,
    );
    const totalMaterialValue = materials.reduce(
      (sum, material) =>
        sum + Number(material.quantity) * Number(material.pricePerUnit),
      0,
    );

    return {
      summary: {
        totalProfit,
        totalExpenses,
        netProfit,
        totalOrders,
        totalOrdersFromUA: ordersFromUA,
        totalOrdersFromEU: ordersFromEU,
      },
      orders: {
        totalCostPrice: totalOrderCostPrice,
        totalSalePrice: totalOrderSalePrice,
        totalCompletedOrders,
        numberOfOrderedOrders: orderedOrders,
        numberOfInProgressOrders: inProgressOrders,
        numberOfCancelledOrders: cancelledOrders,
        orderList: completedOrders,
      },
      expenses: {
        totalExpenses,
        expenseList: expenses,
      },
      materials: {
        totalMaterialQuantity,
        totalMaterialValue,
        materialList: materials,
      },
    };
  }
}
