import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CatalogSyncQueryService } from './catalogsyncquery.service';

@ApiTags('Catalog Sync Log Query')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Autenticación requerida.' })
@Controller('catalogsynclogs/query')
export class CatalogSyncQueryController {
  constructor(private readonly service: CatalogSyncQueryService) {}

  @Get('list')
  @ApiOperation({ summary: 'Get catalog synchronization logs' })
  @ApiResponse({ status: 200, description: 'Catalog sync logs list.' })
  async findAll(): Promise<Record<string, unknown>[]> {
    return this.service.findAll();
  }

  @Get('count')
  @ApiOperation({ summary: 'Count catalog synchronization logs' })
  @ApiResponse({ status: 200, description: 'Catalog sync logs count.' })
  async count(): Promise<number> {
    return this.service.count();
  }

  @Get('field/:field')
  @ApiOperation({ summary: 'Find catalog sync logs by field' })
  @ApiParam({ name: 'field', required: true, type: String })
  @ApiQuery({ name: 'value', required: true, type: String })
  @ApiResponse({ status: 200, description: 'Catalog sync logs filtered by field.' })
  async findByField(
    @Param('field') field: string,
    @Query('value') value: string,
  ): Promise<Record<string, unknown>[]> {
    return this.service.findByField(field, value);
  }
}