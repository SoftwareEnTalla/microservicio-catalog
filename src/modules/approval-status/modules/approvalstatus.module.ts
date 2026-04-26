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
import { ApprovalStatusCommandController } from "../controllers/approvalstatuscommand.controller";
import { ApprovalStatusQueryController } from "../controllers/approvalstatusquery.controller";
import { ApprovalStatusCommandService } from "../services/approvalstatuscommand.service";
import { ApprovalStatusQueryService } from "../services/approvalstatusquery.service";

import { ApprovalStatusCommandRepository } from "../repositories/approvalstatuscommand.repository";
import { ApprovalStatusQueryRepository } from "../repositories/approvalstatusquery.repository";
import { ApprovalStatusRepository } from "../repositories/approvalstatus.repository";
import { ApprovalStatusResolver } from "../graphql/approvalstatus.resolver";
import { ApprovalStatusAuthGuard } from "../guards/approvalstatusauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApprovalStatus } from "../entities/approval-status.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateApprovalStatusHandler } from "../commands/handlers/createapprovalstatus.handler";
import { UpdateApprovalStatusHandler } from "../commands/handlers/updateapprovalstatus.handler";
import { DeleteApprovalStatusHandler } from "../commands/handlers/deleteapprovalstatus.handler";
import { GetApprovalStatusByIdHandler } from "../queries/handlers/getapprovalstatusbyid.handler";
import { GetApprovalStatusByFieldHandler } from "../queries/handlers/getapprovalstatusbyfield.handler";
import { GetAllApprovalStatusHandler } from "../queries/handlers/getallapprovalstatus.handler";
import { ApprovalStatusCrudSaga } from "../sagas/approvalstatus-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { ApprovalStatusInterceptor } from "../interceptors/approvalstatus.interceptor";
import { ApprovalStatusLoggingInterceptor } from "../interceptors/approvalstatus.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, ApprovalStatus]), // Incluir BaseEntity para herencia
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
  controllers: [ApprovalStatusCommandController, ApprovalStatusQueryController],
  providers: [
    //Services
    EventStoreService,
    ApprovalStatusQueryService,
    ApprovalStatusCommandService,
  
    //Repositories
    ApprovalStatusCommandRepository,
    ApprovalStatusQueryRepository,
    ApprovalStatusRepository,      
    //Resolvers
    ApprovalStatusResolver,
    //Guards
    ApprovalStatusAuthGuard,
    //Interceptors
    ApprovalStatusInterceptor,
    ApprovalStatusLoggingInterceptor,
    //CQRS Handlers
    CreateApprovalStatusHandler,
    UpdateApprovalStatusHandler,
    DeleteApprovalStatusHandler,
    GetApprovalStatusByIdHandler,
    GetApprovalStatusByFieldHandler,
    GetAllApprovalStatusHandler,
    ApprovalStatusCrudSaga,
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
    ApprovalStatusQueryService,
    ApprovalStatusCommandService,
  
    //Repositories
    ApprovalStatusCommandRepository,
    ApprovalStatusQueryRepository,
    ApprovalStatusRepository,      
    //Resolvers
    ApprovalStatusResolver,
    //Guards
    ApprovalStatusAuthGuard,
    //Interceptors
    ApprovalStatusInterceptor,
    ApprovalStatusLoggingInterceptor,
  ],
})
export class ApprovalStatusModule {}

