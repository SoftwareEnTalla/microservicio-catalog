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
import { LifecycleStatusCommandController } from "../controllers/lifecyclestatuscommand.controller";
import { LifecycleStatusQueryController } from "../controllers/lifecyclestatusquery.controller";
import { LifecycleStatusCommandService } from "../services/lifecyclestatuscommand.service";
import { LifecycleStatusQueryService } from "../services/lifecyclestatusquery.service";

import { LifecycleStatusCommandRepository } from "../repositories/lifecyclestatuscommand.repository";
import { LifecycleStatusQueryRepository } from "../repositories/lifecyclestatusquery.repository";
import { LifecycleStatusRepository } from "../repositories/lifecyclestatus.repository";
import { LifecycleStatusResolver } from "../graphql/lifecyclestatus.resolver";
import { LifecycleStatusAuthGuard } from "../guards/lifecyclestatusauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LifecycleStatus } from "../entities/lifecycle-status.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateLifecycleStatusHandler } from "../commands/handlers/createlifecyclestatus.handler";
import { UpdateLifecycleStatusHandler } from "../commands/handlers/updatelifecyclestatus.handler";
import { DeleteLifecycleStatusHandler } from "../commands/handlers/deletelifecyclestatus.handler";
import { GetLifecycleStatusByIdHandler } from "../queries/handlers/getlifecyclestatusbyid.handler";
import { GetLifecycleStatusByFieldHandler } from "../queries/handlers/getlifecyclestatusbyfield.handler";
import { GetAllLifecycleStatusHandler } from "../queries/handlers/getalllifecyclestatus.handler";
import { LifecycleStatusCrudSaga } from "../sagas/lifecyclestatus-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { LifecycleStatusInterceptor } from "../interceptors/lifecyclestatus.interceptor";
import { LifecycleStatusLoggingInterceptor } from "../interceptors/lifecyclestatus.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, LifecycleStatus]), // Incluir BaseEntity para herencia
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
  controllers: [LifecycleStatusCommandController, LifecycleStatusQueryController],
  providers: [
    //Services
    EventStoreService,
    LifecycleStatusQueryService,
    LifecycleStatusCommandService,
  
    //Repositories
    LifecycleStatusCommandRepository,
    LifecycleStatusQueryRepository,
    LifecycleStatusRepository,      
    //Resolvers
    LifecycleStatusResolver,
    //Guards
    LifecycleStatusAuthGuard,
    //Interceptors
    LifecycleStatusInterceptor,
    LifecycleStatusLoggingInterceptor,
    //CQRS Handlers
    CreateLifecycleStatusHandler,
    UpdateLifecycleStatusHandler,
    DeleteLifecycleStatusHandler,
    GetLifecycleStatusByIdHandler,
    GetLifecycleStatusByFieldHandler,
    GetAllLifecycleStatusHandler,
    LifecycleStatusCrudSaga,
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
    LifecycleStatusQueryService,
    LifecycleStatusCommandService,
  
    //Repositories
    LifecycleStatusCommandRepository,
    LifecycleStatusQueryRepository,
    LifecycleStatusRepository,      
    //Resolvers
    LifecycleStatusResolver,
    //Guards
    LifecycleStatusAuthGuard,
    //Interceptors
    LifecycleStatusInterceptor,
    LifecycleStatusLoggingInterceptor,
  ],
})
export class LifecycleStatusModule {}

