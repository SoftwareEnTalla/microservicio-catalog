import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CatalogSyncQueryController } from './catalogsyncquery.controller';
import { CatalogSyncQueryService } from './catalogsyncquery.service';

@Module({
  imports: [ConfigModule],
  controllers: [CatalogSyncQueryController],
  providers: [CatalogSyncQueryService],
  exports: [CatalogSyncQueryService],
})
export class CatalogSyncModule {}