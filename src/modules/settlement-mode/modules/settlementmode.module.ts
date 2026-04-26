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
import { SettlementModeCommandController } from "../controllers/settlementmodecommand.controller";
import { SettlementModeQueryController } from "../controllers/settlementmodequery.controller";
import { SettlementModeCommandService } from "../services/settlementmodecommand.service";
import { SettlementModeQueryService } from "../services/settlementmodequery.service";

import { SettlementModeCommandRepository } from "../repositories/settlementmodecommand.repository";
import { SettlementModeQueryRepository } from "../repositories/settlementmodequery.repository";
import { SettlementModeRepository } from "../repositories/settlementmode.repository";
import { SettlementModeResolver } from "../graphql/settlementmode.resolver";
import { SettlementModeAuthGuard } from "../guards/settlementmodeauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SettlementMode } from "../entities/settlement-mode.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateSettlementModeHandler } from "../commands/handlers/createsettlementmode.handler";
import { UpdateSettlementModeHandler } from "../commands/handlers/updatesettlementmode.handler";
import { DeleteSettlementModeHandler } from "../commands/handlers/deletesettlementmode.handler";
import { GetSettlementModeByIdHandler } from "../queries/handlers/getsettlementmodebyid.handler";
import { GetSettlementModeByFieldHandler } from "../queries/handlers/getsettlementmodebyfield.handler";
import { GetAllSettlementModeHandler } from "../queries/handlers/getallsettlementmode.handler";
import { SettlementModeCrudSaga } from "../sagas/settlementmode-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { SettlementModeInterceptor } from "../interceptors/settlementmode.interceptor";
import { SettlementModeLoggingInterceptor } from "../interceptors/settlementmode.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, SettlementMode]), // Incluir BaseEntity para herencia
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
  controllers: [SettlementModeCommandController, SettlementModeQueryController],
  providers: [
    //Services
    EventStoreService,
    SettlementModeQueryService,
    SettlementModeCommandService,
  
    //Repositories
    SettlementModeCommandRepository,
    SettlementModeQueryRepository,
    SettlementModeRepository,      
    //Resolvers
    SettlementModeResolver,
    //Guards
    SettlementModeAuthGuard,
    //Interceptors
    SettlementModeInterceptor,
    SettlementModeLoggingInterceptor,
    //CQRS Handlers
    CreateSettlementModeHandler,
    UpdateSettlementModeHandler,
    DeleteSettlementModeHandler,
    GetSettlementModeByIdHandler,
    GetSettlementModeByFieldHandler,
    GetAllSettlementModeHandler,
    SettlementModeCrudSaga,
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
    SettlementModeQueryService,
    SettlementModeCommandService,
  
    //Repositories
    SettlementModeCommandRepository,
    SettlementModeQueryRepository,
    SettlementModeRepository,      
    //Resolvers
    SettlementModeResolver,
    //Guards
    SettlementModeAuthGuard,
    //Interceptors
    SettlementModeInterceptor,
    SettlementModeLoggingInterceptor,
  ],
})
export class SettlementModeModule {}

