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
import { ActiveStatusExpirableCommandController } from "../controllers/activestatusexpirablecommand.controller";
import { ActiveStatusExpirableQueryController } from "../controllers/activestatusexpirablequery.controller";
import { ActiveStatusExpirableCommandService } from "../services/activestatusexpirablecommand.service";
import { ActiveStatusExpirableQueryService } from "../services/activestatusexpirablequery.service";

import { ActiveStatusExpirableCommandRepository } from "../repositories/activestatusexpirablecommand.repository";
import { ActiveStatusExpirableQueryRepository } from "../repositories/activestatusexpirablequery.repository";
import { ActiveStatusExpirableRepository } from "../repositories/activestatusexpirable.repository";
import { ActiveStatusExpirableResolver } from "../graphql/activestatusexpirable.resolver";
import { ActiveStatusExpirableAuthGuard } from "../guards/activestatusexpirableauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ActiveStatusExpirable } from "../entities/active-status-expirable.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateActiveStatusExpirableHandler } from "../commands/handlers/createactivestatusexpirable.handler";
import { UpdateActiveStatusExpirableHandler } from "../commands/handlers/updateactivestatusexpirable.handler";
import { DeleteActiveStatusExpirableHandler } from "../commands/handlers/deleteactivestatusexpirable.handler";
import { GetActiveStatusExpirableByIdHandler } from "../queries/handlers/getactivestatusexpirablebyid.handler";
import { GetActiveStatusExpirableByFieldHandler } from "../queries/handlers/getactivestatusexpirablebyfield.handler";
import { GetAllActiveStatusExpirableHandler } from "../queries/handlers/getallactivestatusexpirable.handler";
import { ActiveStatusExpirableCrudSaga } from "../sagas/activestatusexpirable-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { ActiveStatusExpirableInterceptor } from "../interceptors/activestatusexpirable.interceptor";
import { ActiveStatusExpirableLoggingInterceptor } from "../interceptors/activestatusexpirable.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, ActiveStatusExpirable]), // Incluir BaseEntity para herencia
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
  controllers: [ActiveStatusExpirableCommandController, ActiveStatusExpirableQueryController],
  providers: [
    //Services
    EventStoreService,
    ActiveStatusExpirableQueryService,
    ActiveStatusExpirableCommandService,
  
    //Repositories
    ActiveStatusExpirableCommandRepository,
    ActiveStatusExpirableQueryRepository,
    ActiveStatusExpirableRepository,      
    //Resolvers
    ActiveStatusExpirableResolver,
    //Guards
    ActiveStatusExpirableAuthGuard,
    //Interceptors
    ActiveStatusExpirableInterceptor,
    ActiveStatusExpirableLoggingInterceptor,
    //CQRS Handlers
    CreateActiveStatusExpirableHandler,
    UpdateActiveStatusExpirableHandler,
    DeleteActiveStatusExpirableHandler,
    GetActiveStatusExpirableByIdHandler,
    GetActiveStatusExpirableByFieldHandler,
    GetAllActiveStatusExpirableHandler,
    ActiveStatusExpirableCrudSaga,
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
    ActiveStatusExpirableQueryService,
    ActiveStatusExpirableCommandService,
  
    //Repositories
    ActiveStatusExpirableCommandRepository,
    ActiveStatusExpirableQueryRepository,
    ActiveStatusExpirableRepository,      
    //Resolvers
    ActiveStatusExpirableResolver,
    //Guards
    ActiveStatusExpirableAuthGuard,
    //Interceptors
    ActiveStatusExpirableInterceptor,
    ActiveStatusExpirableLoggingInterceptor,
  ],
})
export class ActiveStatusExpirableModule {}

