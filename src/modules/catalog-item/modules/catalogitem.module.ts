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
import { CatalogItemCommandController } from "../controllers/catalogitemcommand.controller";
import { CatalogItemQueryController } from "../controllers/catalogitemquery.controller";
import { CatalogItemCommandService } from "../services/catalogitemcommand.service";
import { CatalogItemQueryService } from "../services/catalogitemquery.service";

import { CatalogItemCommandRepository } from "../repositories/catalogitemcommand.repository";
import { CatalogItemQueryRepository } from "../repositories/catalogitemquery.repository";
import { CatalogItemRepository } from "../repositories/catalogitem.repository";
import { CatalogItemResolver } from "../graphql/catalogitem.resolver";
import { CatalogItemAuthGuard } from "../guards/catalogitemauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CatalogItem } from "../entities/catalog-item.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateCatalogItemHandler } from "../commands/handlers/createcatalogitem.handler";
import { UpdateCatalogItemHandler } from "../commands/handlers/updatecatalogitem.handler";
import { DeleteCatalogItemHandler } from "../commands/handlers/deletecatalogitem.handler";
import { GetCatalogItemByIdHandler } from "../queries/handlers/getcatalogitembyid.handler";
import { GetCatalogItemByFieldHandler } from "../queries/handlers/getcatalogitembyfield.handler";
import { GetAllCatalogItemHandler } from "../queries/handlers/getallcatalogitem.handler";
import { CatalogItemCrudSaga } from "../sagas/catalogitem-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { CatalogItemInterceptor } from "../interceptors/catalogitem.interceptor";
import { CatalogItemLoggingInterceptor } from "../interceptors/catalogitem.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, CatalogItem]), // Incluir BaseEntity para herencia
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
  controllers: [CatalogItemCommandController, CatalogItemQueryController],
  providers: [
    //Services
    EventStoreService,
    CatalogItemQueryService,
    CatalogItemCommandService,
  
    //Repositories
    CatalogItemCommandRepository,
    CatalogItemQueryRepository,
    CatalogItemRepository,      
    //Resolvers
    CatalogItemResolver,
    //Guards
    CatalogItemAuthGuard,
    //Interceptors
    CatalogItemInterceptor,
    CatalogItemLoggingInterceptor,
    //CQRS Handlers
    CreateCatalogItemHandler,
    UpdateCatalogItemHandler,
    DeleteCatalogItemHandler,
    GetCatalogItemByIdHandler,
    GetCatalogItemByFieldHandler,
    GetAllCatalogItemHandler,
    CatalogItemCrudSaga,
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
    CatalogItemQueryService,
    CatalogItemCommandService,
  
    //Repositories
    CatalogItemCommandRepository,
    CatalogItemQueryRepository,
    CatalogItemRepository,      
    //Resolvers
    CatalogItemResolver,
    //Guards
    CatalogItemAuthGuard,
    //Interceptors
    CatalogItemInterceptor,
    CatalogItemLoggingInterceptor,
  ],
})
export class CatalogItemModule {}

