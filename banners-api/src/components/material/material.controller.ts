import { Controller, Req, RequestMethod } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MaterialService } from './material.service';
import { AppRequest } from '../../common/interfaces/app-request';
import { AdminEndpoint } from '../../common/decorators/admin-endpoint.decorator';

@ApiTags('Admin')
@Controller('admin')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @AdminEndpoint('material/findAll', RequestMethod.GET)
  findAll(@Req() req: AppRequest) {
    return this.materialService.findAllMaterials(req.query);
  }
}
