/*
 * Copyright (c) 2025 SoftwarEnTalla
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
import { CommandBus, EventBus, UnhandledExceptionBus } from "@nestjs/cqrs";
import { CacheModule } from "@nestjs/cache-manager";

//Interceptors
import { CatalogInterceptor } from "../interceptors/catalog.interceptor";
import { CatalogLoggingInterceptor } from "../interceptors/catalog.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { KafkaService } from "../shared/messaging/kafka.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Catalog]), // Asegúrate de incluir esto
    CacheModule.register(), // Importa el módulo de caché
  ],
  controllers: [CatalogCommandController, CatalogQueryController],
  providers: [
    //Services
    EventStoreService,
    KafkaService,
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
    //Publishers
    KafkaEventPublisher,
    //Others dependencies
    UnhandledExceptionBus, // Manejador global de excepciones
    CommandBus, // Bus de comandos
    EventBus, // Bus de eventos
  ],
  exports: [
    //Services
    EventStoreService,
    KafkaService,
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
    //Publishers
    KafkaEventPublisher,
    //Others dependencies
    UnhandledExceptionBus, // Manejador global de excepciones
    CommandBus, // Bus de comandos
    EventBus, // Bus de eventos
  ],
})
export class CatalogModule {}

