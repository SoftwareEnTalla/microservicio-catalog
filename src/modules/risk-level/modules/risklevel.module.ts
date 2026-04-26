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
import { RiskLevelCommandController } from "../controllers/risklevelcommand.controller";
import { RiskLevelQueryController } from "../controllers/risklevelquery.controller";
import { RiskLevelCommandService } from "../services/risklevelcommand.service";
import { RiskLevelQueryService } from "../services/risklevelquery.service";

import { RiskLevelCommandRepository } from "../repositories/risklevelcommand.repository";
import { RiskLevelQueryRepository } from "../repositories/risklevelquery.repository";
import { RiskLevelRepository } from "../repositories/risklevel.repository";
import { RiskLevelResolver } from "../graphql/risklevel.resolver";
import { RiskLevelAuthGuard } from "../guards/risklevelauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RiskLevel } from "../entities/risk-level.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateRiskLevelHandler } from "../commands/handlers/createrisklevel.handler";
import { UpdateRiskLevelHandler } from "../commands/handlers/updaterisklevel.handler";
import { DeleteRiskLevelHandler } from "../commands/handlers/deleterisklevel.handler";
import { GetRiskLevelByIdHandler } from "../queries/handlers/getrisklevelbyid.handler";
import { GetRiskLevelByFieldHandler } from "../queries/handlers/getrisklevelbyfield.handler";
import { GetAllRiskLevelHandler } from "../queries/handlers/getallrisklevel.handler";
import { RiskLevelCrudSaga } from "../sagas/risklevel-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { RiskLevelInterceptor } from "../interceptors/risklevel.interceptor";
import { RiskLevelLoggingInterceptor } from "../interceptors/risklevel.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, RiskLevel]), // Incluir BaseEntity para herencia
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
  controllers: [RiskLevelCommandController, RiskLevelQueryController],
  providers: [
    //Services
    EventStoreService,
    RiskLevelQueryService,
    RiskLevelCommandService,
  
    //Repositories
    RiskLevelCommandRepository,
    RiskLevelQueryRepository,
    RiskLevelRepository,      
    //Resolvers
    RiskLevelResolver,
    //Guards
    RiskLevelAuthGuard,
    //Interceptors
    RiskLevelInterceptor,
    RiskLevelLoggingInterceptor,
    //CQRS Handlers
    CreateRiskLevelHandler,
    UpdateRiskLevelHandler,
    DeleteRiskLevelHandler,
    GetRiskLevelByIdHandler,
    GetRiskLevelByFieldHandler,
    GetAllRiskLevelHandler,
    RiskLevelCrudSaga,
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
    RiskLevelQueryService,
    RiskLevelCommandService,
  
    //Repositories
    RiskLevelCommandRepository,
    RiskLevelQueryRepository,
    RiskLevelRepository,      
    //Resolvers
    RiskLevelResolver,
    //Guards
    RiskLevelAuthGuard,
    //Interceptors
    RiskLevelInterceptor,
    RiskLevelLoggingInterceptor,
  ],
})
export class RiskLevelModule {}

