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
import { DocumentTypeExtendedCommandController } from "../controllers/documenttypeextendedcommand.controller";
import { DocumentTypeExtendedQueryController } from "../controllers/documenttypeextendedquery.controller";
import { DocumentTypeExtendedCommandService } from "../services/documenttypeextendedcommand.service";
import { DocumentTypeExtendedQueryService } from "../services/documenttypeextendedquery.service";

import { DocumentTypeExtendedCommandRepository } from "../repositories/documenttypeextendedcommand.repository";
import { DocumentTypeExtendedQueryRepository } from "../repositories/documenttypeextendedquery.repository";
import { DocumentTypeExtendedRepository } from "../repositories/documenttypeextended.repository";
import { DocumentTypeExtendedResolver } from "../graphql/documenttypeextended.resolver";
import { DocumentTypeExtendedAuthGuard } from "../guards/documenttypeextendedauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DocumentTypeExtended } from "../entities/document-type-extended.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateDocumentTypeExtendedHandler } from "../commands/handlers/createdocumenttypeextended.handler";
import { UpdateDocumentTypeExtendedHandler } from "../commands/handlers/updatedocumenttypeextended.handler";
import { DeleteDocumentTypeExtendedHandler } from "../commands/handlers/deletedocumenttypeextended.handler";
import { GetDocumentTypeExtendedByIdHandler } from "../queries/handlers/getdocumenttypeextendedbyid.handler";
import { GetDocumentTypeExtendedByFieldHandler } from "../queries/handlers/getdocumenttypeextendedbyfield.handler";
import { GetAllDocumentTypeExtendedHandler } from "../queries/handlers/getalldocumenttypeextended.handler";
import { DocumentTypeExtendedCrudSaga } from "../sagas/documenttypeextended-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { DocumentTypeExtendedInterceptor } from "../interceptors/documenttypeextended.interceptor";
import { DocumentTypeExtendedLoggingInterceptor } from "../interceptors/documenttypeextended.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, DocumentTypeExtended]), // Incluir BaseEntity para herencia
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
  controllers: [DocumentTypeExtendedCommandController, DocumentTypeExtendedQueryController],
  providers: [
    //Services
    EventStoreService,
    DocumentTypeExtendedQueryService,
    DocumentTypeExtendedCommandService,
  
    //Repositories
    DocumentTypeExtendedCommandRepository,
    DocumentTypeExtendedQueryRepository,
    DocumentTypeExtendedRepository,      
    //Resolvers
    DocumentTypeExtendedResolver,
    //Guards
    DocumentTypeExtendedAuthGuard,
    //Interceptors
    DocumentTypeExtendedInterceptor,
    DocumentTypeExtendedLoggingInterceptor,
    //CQRS Handlers
    CreateDocumentTypeExtendedHandler,
    UpdateDocumentTypeExtendedHandler,
    DeleteDocumentTypeExtendedHandler,
    GetDocumentTypeExtendedByIdHandler,
    GetDocumentTypeExtendedByFieldHandler,
    GetAllDocumentTypeExtendedHandler,
    DocumentTypeExtendedCrudSaga,
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
    DocumentTypeExtendedQueryService,
    DocumentTypeExtendedCommandService,
  
    //Repositories
    DocumentTypeExtendedCommandRepository,
    DocumentTypeExtendedQueryRepository,
    DocumentTypeExtendedRepository,      
    //Resolvers
    DocumentTypeExtendedResolver,
    //Guards
    DocumentTypeExtendedAuthGuard,
    //Interceptors
    DocumentTypeExtendedInterceptor,
    DocumentTypeExtendedLoggingInterceptor,
  ],
})
export class DocumentTypeExtendedModule {}

