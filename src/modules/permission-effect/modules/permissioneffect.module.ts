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
import { PermissionEffectCommandController } from "../controllers/permissioneffectcommand.controller";
import { PermissionEffectQueryController } from "../controllers/permissioneffectquery.controller";
import { PermissionEffectCommandService } from "../services/permissioneffectcommand.service";
import { PermissionEffectQueryService } from "../services/permissioneffectquery.service";

import { PermissionEffectCommandRepository } from "../repositories/permissioneffectcommand.repository";
import { PermissionEffectQueryRepository } from "../repositories/permissioneffectquery.repository";
import { PermissionEffectRepository } from "../repositories/permissioneffect.repository";
import { PermissionEffectResolver } from "../graphql/permissioneffect.resolver";
import { PermissionEffectAuthGuard } from "../guards/permissioneffectauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PermissionEffect } from "../entities/permission-effect.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreatePermissionEffectHandler } from "../commands/handlers/createpermissioneffect.handler";
import { UpdatePermissionEffectHandler } from "../commands/handlers/updatepermissioneffect.handler";
import { DeletePermissionEffectHandler } from "../commands/handlers/deletepermissioneffect.handler";
import { GetPermissionEffectByIdHandler } from "../queries/handlers/getpermissioneffectbyid.handler";
import { GetPermissionEffectByFieldHandler } from "../queries/handlers/getpermissioneffectbyfield.handler";
import { GetAllPermissionEffectHandler } from "../queries/handlers/getallpermissioneffect.handler";
import { PermissionEffectCrudSaga } from "../sagas/permissioneffect-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { PermissionEffectInterceptor } from "../interceptors/permissioneffect.interceptor";
import { PermissionEffectLoggingInterceptor } from "../interceptors/permissioneffect.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, PermissionEffect]), // Incluir BaseEntity para herencia
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
  controllers: [PermissionEffectCommandController, PermissionEffectQueryController],
  providers: [
    //Services
    EventStoreService,
    PermissionEffectQueryService,
    PermissionEffectCommandService,
  
    //Repositories
    PermissionEffectCommandRepository,
    PermissionEffectQueryRepository,
    PermissionEffectRepository,      
    //Resolvers
    PermissionEffectResolver,
    //Guards
    PermissionEffectAuthGuard,
    //Interceptors
    PermissionEffectInterceptor,
    PermissionEffectLoggingInterceptor,
    //CQRS Handlers
    CreatePermissionEffectHandler,
    UpdatePermissionEffectHandler,
    DeletePermissionEffectHandler,
    GetPermissionEffectByIdHandler,
    GetPermissionEffectByFieldHandler,
    GetAllPermissionEffectHandler,
    PermissionEffectCrudSaga,
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
    PermissionEffectQueryService,
    PermissionEffectCommandService,
  
    //Repositories
    PermissionEffectCommandRepository,
    PermissionEffectQueryRepository,
    PermissionEffectRepository,      
    //Resolvers
    PermissionEffectResolver,
    //Guards
    PermissionEffectAuthGuard,
    //Interceptors
    PermissionEffectInterceptor,
    PermissionEffectLoggingInterceptor,
  ],
})
export class PermissionEffectModule {}

