import { ApiTags } from '@nestjs/swagger';
import { Controller, Query, RequestMethod } from '@nestjs/common';
import { StatisticsService } from './statistic.service';
import { AdminEndpoint } from '../../common/decorators/admin-endpoint.decorator';

@ApiTags('Admin')
@Controller('admin')
export class StatisticController {
  constructor(private readonly statisticService: StatisticsService) {}

  @AdminEndpoint('get-statistic', RequestMethod.GET)
  async getStatistics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('sortField') sortField?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    const queryParams = {
      startDate,
      endDate,
      sortField: sortField || 'createdAt',
      sortOrder: sortOrder || 'ASC',
    };

    return this.statisticService.getStatistics(queryParams);
  }
}
