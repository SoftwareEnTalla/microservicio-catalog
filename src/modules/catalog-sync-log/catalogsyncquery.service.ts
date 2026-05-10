import { Injectable, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CatalogSyncQueryService {
  private readonly allowedFields = new Set([
    'id',
    'type',
    'creationDate',
    'modificationDate',
    'createdBy',
    'isActive',
    'name',
    'description',
    'categoryCode',
    'triggeredBy',
    'itemsAddedCount',
    'itemsUpdatedCount',
    'itemsRemovedCount',
    'reason',
    'catalogVersion',
    'catalogHash',
    'durationMs',
    'outcome',
    'errorMessage',
    'syncedAt',
  ]);

  constructor(
    @Optional() @InjectDataSource() private readonly dataSource: DataSource | undefined,
    private readonly configService: ConfigService,
  ) {}

  async findAll(): Promise<Record<string, unknown>[]> {
    const dataSource = await this.resolveDataSource();
    if (!dataSource) {
      return [];
    }

    return dataSource.query(
      `SELECT * FROM ${this.tableName()} ORDER BY "syncedAt" DESC, "creationDate" DESC LIMIT 500`,
    );
  }

  async count(): Promise<number> {
    const dataSource = await this.resolveDataSource();
    if (!dataSource) {
      return 0;
    }

    const rows = await dataSource.query(
      `SELECT COUNT(*)::int AS total FROM ${this.tableName()}`,
    );
    return Number(rows?.[0]?.total ?? 0);
  }

  async findByField(field: string, value: string): Promise<Record<string, unknown>[]> {
    const dataSource = await this.resolveDataSource();
    if (!this.allowedFields.has(field) || !dataSource) {
      return [];
    }

    return dataSource.query(
      `SELECT * FROM ${this.tableName()} WHERE "${field}"::text = $1 ORDER BY "syncedAt" DESC, "creationDate" DESC LIMIT 500`,
      [value],
    );
  }

  private async resolveDataSource(): Promise<DataSource | null> {
    if (this.dataSource?.isInitialized) {
      return this.dataSource;
    }

    return null;
  }

  private tableName(): string {
    return this.configService.get<string>('CATALOG_SYNC_LOG_TABLE') ?? 'catalog_sync_log_base_entity';
  }
}