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
import { ActiveStatusCommandController } from "../controllers/activestatuscommand.controller";
import { ActiveStatusQueryController } from "../controllers/activestatusquery.controller";
import { ActiveStatusCommandService } from "../services/activestatuscommand.service";
import { ActiveStatusQueryService } from "../services/activestatusquery.service";

import { ActiveStatusCommandRepository } from "../repositories/activestatuscommand.repository";
import { ActiveStatusQueryRepository } from "../repositories/activestatusquery.repository";
import { ActiveStatusRepository } from "../repositories/activestatus.repository";
import { ActiveStatusResolver } from "../graphql/activestatus.resolver";
import { ActiveStatusAuthGuard } from "../guards/activestatusauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ActiveStatus } from "../entities/active-status.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateActiveStatusHandler } from "../commands/handlers/createactivestatus.handler";
import { UpdateActiveStatusHandler } from "../commands/handlers/updateactivestatus.handler";
import { DeleteActiveStatusHandler } from "../commands/handlers/deleteactivestatus.handler";
import { GetActiveStatusByIdHandler } from "../queries/handlers/getactivestatusbyid.handler";
import { GetActiveStatusByFieldHandler } from "../queries/handlers/getactivestatusbyfield.handler";
import { GetAllActiveStatusHandler } from "../queries/handlers/getallactivestatus.handler";
import { ActiveStatusCrudSaga } from "../sagas/activestatus-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { ActiveStatusInterceptor } from "../interceptors/activestatus.interceptor";
import { ActiveStatusLoggingInterceptor } from "../interceptors/activestatus.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, ActiveStatus]), // Incluir BaseEntity para herencia
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
  controllers: [ActiveStatusCommandController, ActiveStatusQueryController],
  providers: [
    //Services
    EventStoreService,
    ActiveStatusQueryService,
    ActiveStatusCommandService,
  
    //Repositories
    ActiveStatusCommandRepository,
    ActiveStatusQueryRepository,
    ActiveStatusRepository,      
    //Resolvers
    ActiveStatusResolver,
    //Guards
    ActiveStatusAuthGuard,
    //Interceptors
    ActiveStatusInterceptor,
    ActiveStatusLoggingInterceptor,
    //CQRS Handlers
    CreateActiveStatusHandler,
    UpdateActiveStatusHandler,
    DeleteActiveStatusHandler,
    GetActiveStatusByIdHandler,
    GetActiveStatusByFieldHandler,
    GetAllActiveStatusHandler,
    ActiveStatusCrudSaga,
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
    ActiveStatusQueryService,
    ActiveStatusCommandService,
  
    //Repositories
    ActiveStatusCommandRepository,
    ActiveStatusQueryRepository,
    ActiveStatusRepository,      
    //Resolvers
    ActiveStatusResolver,
    //Guards
    ActiveStatusAuthGuard,
    //Interceptors
    ActiveStatusInterceptor,
    ActiveStatusLoggingInterceptor,
  ],
})
export class ActiveStatusModule {}

