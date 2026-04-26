/*
 * Copyright (c) 2026 SoftwarEnTalla
 * Licencia: MIT
 * Contacto: softwarentalla@gmail.com
 * CEOs: 
 *       Persy Morell Guerra      Email: pmorellpersi@gmail.com  Phone : +53-5336-4654 Linkedin: https://www.linkedin.com/in/persy-morell-guerra-288943357/
 *       Dailyn García Domínguez  Email: dailyngd@gmail.com      Phone : +53-5432-0312 Linkedin: https://www.linkedin.com/in/dailyn-dominguez-3150799b/
 *
 * CTO: Persy Morell Guerra
 * COO: Dailyn García Domínguez and Persy Morell Guerra
 * CFO: Dailyn García Domínguez and Persy Morell Guerra
 *
 * Repositories: 
 *               https://github.com/SoftwareEnTalla 
 *
 *               https://github.com/apokaliptolesamale?tab=repositories
 *
 *
 * Social Networks:
 *
 *              https://x.com/SoftwarEnTalla
 *
 *              https://www.facebook.com/profile.php?id=61572625716568
 *
 *              https://www.instagram.com/softwarentalla/
 *              
 *
 *
 */


import { Module } from "@nestjs/common";
import { UpstreamSyncStatusCommandController } from "../controllers/upstreamsyncstatuscommand.controller";
import { UpstreamSyncStatusQueryController } from "../controllers/upstreamsyncstatusquery.controller";
import { UpstreamSyncStatusCommandService } from "../services/upstreamsyncstatuscommand.service";
import { UpstreamSyncStatusQueryService } from "../services/upstreamsyncstatusquery.service";

import { UpstreamSyncStatusCommandRepository } from "../repositories/upstreamsyncstatuscommand.repository";
import { UpstreamSyncStatusQueryRepository } from "../repositories/upstreamsyncstatusquery.repository";
import { UpstreamSyncStatusRepository } from "../repositories/upstreamsyncstatus.repository";
import { UpstreamSyncStatusResolver } from "../graphql/upstreamsyncstatus.resolver";
import { UpstreamSyncStatusAuthGuard } from "../guards/upstreamsyncstatusauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UpstreamSyncStatus } from "../entities/upstream-sync-status.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateUpstreamSyncStatusHandler } from "../commands/handlers/createupstreamsyncstatus.handler";
import { UpdateUpstreamSyncStatusHandler } from "../commands/handlers/updateupstreamsyncstatus.handler";
import { DeleteUpstreamSyncStatusHandler } from "../commands/handlers/deleteupstreamsyncstatus.handler";
import { GetUpstreamSyncStatusByIdHandler } from "../queries/handlers/getupstreamsyncstatusbyid.handler";
import { GetUpstreamSyncStatusByFieldHandler } from "../queries/handlers/getupstreamsyncstatusbyfield.handler";
import { GetAllUpstreamSyncStatusHandler } from "../queries/handlers/getallupstreamsyncstatus.handler";
import { UpstreamSyncStatusCrudSaga } from "../sagas/upstreamsyncstatus-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { UpstreamSyncStatusInterceptor } from "../interceptors/upstreamsyncstatus.interceptor";
import { UpstreamSyncStatusLoggingInterceptor } from "../interceptors/upstreamsyncstatus.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, UpstreamSyncStatus]), // Incluir BaseEntity para herencia
    CacheModule.registerAsync({
      useFactory: async () => {
        try {
          const store = await redisStore({
            socket: { host: process.env.REDIS_HOST || "data-center-redis", port: parseInt(process.env.REDIS_PORT || "6379", 10) },
            ttl: parseInt(process.env.REDIS_TTL || "60", 10),
          });
          return { store: store as any, isGlobal: true };
        } catch {
          return { isGlobal: true }; // fallback in-memory
        }
      },
    }),
  ],
  controllers: [UpstreamSyncStatusCommandController, UpstreamSyncStatusQueryController],
  providers: [
    //Services
    EventStoreService,
    UpstreamSyncStatusQueryService,
    UpstreamSyncStatusCommandService,
  
    //Repositories
    UpstreamSyncStatusCommandRepository,
    UpstreamSyncStatusQueryRepository,
    UpstreamSyncStatusRepository,      
    //Resolvers
    UpstreamSyncStatusResolver,
    //Guards
    UpstreamSyncStatusAuthGuard,
    //Interceptors
    UpstreamSyncStatusInterceptor,
    UpstreamSyncStatusLoggingInterceptor,
    //CQRS Handlers
    CreateUpstreamSyncStatusHandler,
    UpdateUpstreamSyncStatusHandler,
    DeleteUpstreamSyncStatusHandler,
    GetUpstreamSyncStatusByIdHandler,
    GetUpstreamSyncStatusByFieldHandler,
    GetAllUpstreamSyncStatusHandler,
    UpstreamSyncStatusCrudSaga,
    //Configurations
    {
      provide: 'EVENT_SOURCING_CONFIG',
      useFactory: () => ({
        enabled: process.env.EVENT_SOURCING_ENABLED !== 'false',
        kafkaEnabled: process.env.KAFKA_ENABLED !== 'false',
        eventStoreEnabled: process.env.EVENT_STORE_ENABLED === 'true',
        publishEvents: true,
        useProjections: true,
        topics: EVENT_TOPICS
      })
    },
  ],
  exports: [
    CqrsModule,
    KafkaModule,
    //Services
    EventStoreService,
    UpstreamSyncStatusQueryService,
    UpstreamSyncStatusCommandService,
  
    //Repositories
    UpstreamSyncStatusCommandRepository,
    UpstreamSyncStatusQueryRepository,
    UpstreamSyncStatusRepository,      
    //Resolvers
    UpstreamSyncStatusResolver,
    //Guards
    UpstreamSyncStatusAuthGuard,
    //Interceptors
    UpstreamSyncStatusInterceptor,
    UpstreamSyncStatusLoggingInterceptor,
  ],
})
export class UpstreamSyncStatusModule {}

