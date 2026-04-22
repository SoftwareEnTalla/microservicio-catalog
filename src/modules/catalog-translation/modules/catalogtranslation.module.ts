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
import { CatalogTranslationCommandController } from "../controllers/catalogtranslationcommand.controller";
import { CatalogTranslationQueryController } from "../controllers/catalogtranslationquery.controller";
import { CatalogTranslationCommandService } from "../services/catalogtranslationcommand.service";
import { CatalogTranslationQueryService } from "../services/catalogtranslationquery.service";

import { CatalogTranslationCommandRepository } from "../repositories/catalogtranslationcommand.repository";
import { CatalogTranslationQueryRepository } from "../repositories/catalogtranslationquery.repository";
import { CatalogTranslationRepository } from "../repositories/catalogtranslation.repository";
import { CatalogTranslationResolver } from "../graphql/catalogtranslation.resolver";
import { CatalogTranslationAuthGuard } from "../guards/catalogtranslationauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CatalogTranslation } from "../entities/catalog-translation.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateCatalogTranslationHandler } from "../commands/handlers/createcatalogtranslation.handler";
import { UpdateCatalogTranslationHandler } from "../commands/handlers/updatecatalogtranslation.handler";
import { DeleteCatalogTranslationHandler } from "../commands/handlers/deletecatalogtranslation.handler";
import { GetCatalogTranslationByIdHandler } from "../queries/handlers/getcatalogtranslationbyid.handler";
import { GetCatalogTranslationByFieldHandler } from "../queries/handlers/getcatalogtranslationbyfield.handler";
import { GetAllCatalogTranslationHandler } from "../queries/handlers/getallcatalogtranslation.handler";
import { CatalogTranslationCrudSaga } from "../sagas/catalogtranslation-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { CatalogTranslationInterceptor } from "../interceptors/catalogtranslation.interceptor";
import { CatalogTranslationLoggingInterceptor } from "../interceptors/catalogtranslation.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, CatalogTranslation]), // Incluir BaseEntity para herencia
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
  controllers: [CatalogTranslationCommandController, CatalogTranslationQueryController],
  providers: [
    //Services
    EventStoreService,
    CatalogTranslationQueryService,
    CatalogTranslationCommandService,
  
    //Repositories
    CatalogTranslationCommandRepository,
    CatalogTranslationQueryRepository,
    CatalogTranslationRepository,      
    //Resolvers
    CatalogTranslationResolver,
    //Guards
    CatalogTranslationAuthGuard,
    //Interceptors
    CatalogTranslationInterceptor,
    CatalogTranslationLoggingInterceptor,
    //CQRS Handlers
    CreateCatalogTranslationHandler,
    UpdateCatalogTranslationHandler,
    DeleteCatalogTranslationHandler,
    GetCatalogTranslationByIdHandler,
    GetCatalogTranslationByFieldHandler,
    GetAllCatalogTranslationHandler,
    CatalogTranslationCrudSaga,
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
    CatalogTranslationQueryService,
    CatalogTranslationCommandService,
  
    //Repositories
    CatalogTranslationCommandRepository,
    CatalogTranslationQueryRepository,
    CatalogTranslationRepository,      
    //Resolvers
    CatalogTranslationResolver,
    //Guards
    CatalogTranslationAuthGuard,
    //Interceptors
    CatalogTranslationInterceptor,
    CatalogTranslationLoggingInterceptor,
  ],
})
export class CatalogTranslationModule {}

