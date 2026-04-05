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
import { CatalogCommandController } from "../controllers/catalogcommand.controller";
import { CatalogQueryController } from "../controllers/catalogquery.controller";
import { CatalogCommandService } from "../services/catalogcommand.service";
import { CatalogQueryService } from "../services/catalogquery.service";
import { CatalogCommandRepository } from "../repositories/catalogcommand.repository";
import { CatalogQueryRepository } from "../repositories/catalogquery.repository";
import { CatalogRepository } from "../repositories/catalog.repository";
import { CatalogResolver } from "../graphql/catalog.resolver";
import { CatalogAuthGuard } from "../guards/catalogauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Catalog } from "../entities/catalog.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateCatalogHandler } from "../commands/handlers/createcatalog.handler";
import { UpdateCatalogHandler } from "../commands/handlers/updatecatalog.handler";
import { DeleteCatalogHandler } from "../commands/handlers/deletecatalog.handler";
import { GetCatalogByIdHandler } from "../queries/handlers/getcatalogbyid.handler";
import { GetCatalogByFieldHandler } from "../queries/handlers/getcatalogbyfield.handler";
import { GetAllCatalogHandler } from "../queries/handlers/getallcatalog.handler";
import { CatalogCrudSaga } from "../sagas/catalog-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { CatalogInterceptor } from "../interceptors/catalog.interceptor";
import { CatalogLoggingInterceptor } from "../interceptors/catalog.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, Catalog]), // Incluir BaseEntity para herencia
    CacheModule.register(), // Importa el módulo de caché
  ],
  controllers: [CatalogCommandController, CatalogQueryController],
  providers: [
    //Services
    EventStoreService,
    CatalogQueryService,
    CatalogCommandService,
    //Repositories
    CatalogCommandRepository,
    CatalogQueryRepository,
    CatalogRepository,      
    //Resolvers
    CatalogResolver,
    //Guards
    CatalogAuthGuard,
    //Interceptors
    CatalogInterceptor,
    CatalogLoggingInterceptor,
    //CQRS Handlers
    CreateCatalogHandler,
    UpdateCatalogHandler,
    DeleteCatalogHandler,
    GetCatalogByIdHandler,
    GetCatalogByFieldHandler,
    GetAllCatalogHandler,
    CatalogCrudSaga,
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
    CatalogQueryService,
    CatalogCommandService,
    //Repositories
    CatalogCommandRepository,
    CatalogQueryRepository,
    CatalogRepository,      
    //Resolvers
    CatalogResolver,
    //Guards
    CatalogAuthGuard,
    //Interceptors
    CatalogInterceptor,
    CatalogLoggingInterceptor,
  ],
})
export class CatalogModule {}

