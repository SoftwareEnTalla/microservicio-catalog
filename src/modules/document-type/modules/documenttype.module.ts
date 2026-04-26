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
import { DocumentTypeCommandController } from "../controllers/documenttypecommand.controller";
import { DocumentTypeQueryController } from "../controllers/documenttypequery.controller";
import { DocumentTypeCommandService } from "../services/documenttypecommand.service";
import { DocumentTypeQueryService } from "../services/documenttypequery.service";

import { DocumentTypeCommandRepository } from "../repositories/documenttypecommand.repository";
import { DocumentTypeQueryRepository } from "../repositories/documenttypequery.repository";
import { DocumentTypeRepository } from "../repositories/documenttype.repository";
import { DocumentTypeResolver } from "../graphql/documenttype.resolver";
import { DocumentTypeAuthGuard } from "../guards/documenttypeauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DocumentType } from "../entities/document-type.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateDocumentTypeHandler } from "../commands/handlers/createdocumenttype.handler";
import { UpdateDocumentTypeHandler } from "../commands/handlers/updatedocumenttype.handler";
import { DeleteDocumentTypeHandler } from "../commands/handlers/deletedocumenttype.handler";
import { GetDocumentTypeByIdHandler } from "../queries/handlers/getdocumenttypebyid.handler";
import { GetDocumentTypeByFieldHandler } from "../queries/handlers/getdocumenttypebyfield.handler";
import { GetAllDocumentTypeHandler } from "../queries/handlers/getalldocumenttype.handler";
import { DocumentTypeCrudSaga } from "../sagas/documenttype-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { DocumentTypeInterceptor } from "../interceptors/documenttype.interceptor";
import { DocumentTypeLoggingInterceptor } from "../interceptors/documenttype.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, DocumentType]), // Incluir BaseEntity para herencia
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
  controllers: [DocumentTypeCommandController, DocumentTypeQueryController],
  providers: [
    //Services
    EventStoreService,
    DocumentTypeQueryService,
    DocumentTypeCommandService,
  
    //Repositories
    DocumentTypeCommandRepository,
    DocumentTypeQueryRepository,
    DocumentTypeRepository,      
    //Resolvers
    DocumentTypeResolver,
    //Guards
    DocumentTypeAuthGuard,
    //Interceptors
    DocumentTypeInterceptor,
    DocumentTypeLoggingInterceptor,
    //CQRS Handlers
    CreateDocumentTypeHandler,
    UpdateDocumentTypeHandler,
    DeleteDocumentTypeHandler,
    GetDocumentTypeByIdHandler,
    GetDocumentTypeByFieldHandler,
    GetAllDocumentTypeHandler,
    DocumentTypeCrudSaga,
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
    DocumentTypeQueryService,
    DocumentTypeCommandService,
  
    //Repositories
    DocumentTypeCommandRepository,
    DocumentTypeQueryRepository,
    DocumentTypeRepository,      
    //Resolvers
    DocumentTypeResolver,
    //Guards
    DocumentTypeAuthGuard,
    //Interceptors
    DocumentTypeInterceptor,
    DocumentTypeLoggingInterceptor,
  ],
})
export class DocumentTypeModule {}

