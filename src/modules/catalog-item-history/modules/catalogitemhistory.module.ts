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
import { CatalogItemHistoryCommandController } from "../controllers/catalogitemhistorycommand.controller";
import { CatalogItemHistoryQueryController } from "../controllers/catalogitemhistoryquery.controller";
import { CatalogItemHistoryCommandService } from "../services/catalogitemhistorycommand.service";
import { CatalogItemHistoryQueryService } from "../services/catalogitemhistoryquery.service";

import { CatalogItemHistoryCommandRepository } from "../repositories/catalogitemhistorycommand.repository";
import { CatalogItemHistoryQueryRepository } from "../repositories/catalogitemhistoryquery.repository";
import { CatalogItemHistoryRepository } from "../repositories/catalogitemhistory.repository";
import { CatalogItemHistoryResolver } from "../graphql/catalogitemhistory.resolver";
import { CatalogItemHistoryAuthGuard } from "../guards/catalogitemhistoryauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CatalogItemHistory } from "../entities/catalog-item-history.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateCatalogItemHistoryHandler } from "../commands/handlers/createcatalogitemhistory.handler";
import { UpdateCatalogItemHistoryHandler } from "../commands/handlers/updatecatalogitemhistory.handler";
import { DeleteCatalogItemHistoryHandler } from "../commands/handlers/deletecatalogitemhistory.handler";
import { GetCatalogItemHistoryByIdHandler } from "../queries/handlers/getcatalogitemhistorybyid.handler";
import { GetCatalogItemHistoryByFieldHandler } from "../queries/handlers/getcatalogitemhistorybyfield.handler";
import { GetAllCatalogItemHistoryHandler } from "../queries/handlers/getallcatalogitemhistory.handler";
import { CatalogItemHistoryCrudSaga } from "../sagas/catalogitemhistory-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { CatalogItemHistoryInterceptor } from "../interceptors/catalogitemhistory.interceptor";
import { CatalogItemHistoryLoggingInterceptor } from "../interceptors/catalogitemhistory.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, CatalogItemHistory]), // Incluir BaseEntity para herencia
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
  controllers: [CatalogItemHistoryCommandController, CatalogItemHistoryQueryController],
  providers: [
    //Services
    EventStoreService,
    CatalogItemHistoryQueryService,
    CatalogItemHistoryCommandService,
  
    //Repositories
    CatalogItemHistoryCommandRepository,
    CatalogItemHistoryQueryRepository,
    CatalogItemHistoryRepository,      
    //Resolvers
    CatalogItemHistoryResolver,
    //Guards
    CatalogItemHistoryAuthGuard,
    //Interceptors
    CatalogItemHistoryInterceptor,
    CatalogItemHistoryLoggingInterceptor,
    //CQRS Handlers
    CreateCatalogItemHistoryHandler,
    UpdateCatalogItemHistoryHandler,
    DeleteCatalogItemHistoryHandler,
    GetCatalogItemHistoryByIdHandler,
    GetCatalogItemHistoryByFieldHandler,
    GetAllCatalogItemHistoryHandler,
    CatalogItemHistoryCrudSaga,
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
    CatalogItemHistoryQueryService,
    CatalogItemHistoryCommandService,
  
    //Repositories
    CatalogItemHistoryCommandRepository,
    CatalogItemHistoryQueryRepository,
    CatalogItemHistoryRepository,      
    //Resolvers
    CatalogItemHistoryResolver,
    //Guards
    CatalogItemHistoryAuthGuard,
    //Interceptors
    CatalogItemHistoryInterceptor,
    CatalogItemHistoryLoggingInterceptor,
  ],
})
export class CatalogItemHistoryModule {}

