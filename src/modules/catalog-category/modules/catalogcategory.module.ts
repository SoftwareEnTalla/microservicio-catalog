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
import { CatalogCategoryCommandController } from "../controllers/catalogcategorycommand.controller";
import { CatalogCategoryQueryController } from "../controllers/catalogcategoryquery.controller";
import { CatalogCategoryCommandService } from "../services/catalogcategorycommand.service";
import { CatalogCategoryQueryService } from "../services/catalogcategoryquery.service";

import { CatalogCategoryCommandRepository } from "../repositories/catalogcategorycommand.repository";
import { CatalogCategoryQueryRepository } from "../repositories/catalogcategoryquery.repository";
import { CatalogCategoryRepository } from "../repositories/catalogcategory.repository";
import { CatalogCategoryResolver } from "../graphql/catalogcategory.resolver";
import { CatalogCategoryAuthGuard } from "../guards/catalogcategoryauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CatalogCategory } from "../entities/catalog-category.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateCatalogCategoryHandler } from "../commands/handlers/createcatalogcategory.handler";
import { UpdateCatalogCategoryHandler } from "../commands/handlers/updatecatalogcategory.handler";
import { DeleteCatalogCategoryHandler } from "../commands/handlers/deletecatalogcategory.handler";
import { GetCatalogCategoryByIdHandler } from "../queries/handlers/getcatalogcategorybyid.handler";
import { GetCatalogCategoryByFieldHandler } from "../queries/handlers/getcatalogcategorybyfield.handler";
import { GetAllCatalogCategoryHandler } from "../queries/handlers/getallcatalogcategory.handler";
import { CatalogCategoryCrudSaga } from "../sagas/catalogcategory-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { CatalogCategoryInterceptor } from "../interceptors/catalogcategory.interceptor";
import { CatalogCategoryLoggingInterceptor } from "../interceptors/catalogcategory.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, CatalogCategory]), // Incluir BaseEntity para herencia
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
  controllers: [CatalogCategoryCommandController, CatalogCategoryQueryController],
  providers: [
    //Services
    EventStoreService,
    CatalogCategoryQueryService,
    CatalogCategoryCommandService,
  
    //Repositories
    CatalogCategoryCommandRepository,
    CatalogCategoryQueryRepository,
    CatalogCategoryRepository,      
    //Resolvers
    CatalogCategoryResolver,
    //Guards
    CatalogCategoryAuthGuard,
    //Interceptors
    CatalogCategoryInterceptor,
    CatalogCategoryLoggingInterceptor,
    //CQRS Handlers
    CreateCatalogCategoryHandler,
    UpdateCatalogCategoryHandler,
    DeleteCatalogCategoryHandler,
    GetCatalogCategoryByIdHandler,
    GetCatalogCategoryByFieldHandler,
    GetAllCatalogCategoryHandler,
    CatalogCategoryCrudSaga,
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
    CatalogCategoryQueryService,
    CatalogCategoryCommandService,
  
    //Repositories
    CatalogCategoryCommandRepository,
    CatalogCategoryQueryRepository,
    CatalogCategoryRepository,      
    //Resolvers
    CatalogCategoryResolver,
    //Guards
    CatalogCategoryAuthGuard,
    //Interceptors
    CatalogCategoryInterceptor,
    CatalogCategoryLoggingInterceptor,
  ],
})
export class CatalogCategoryModule {}

