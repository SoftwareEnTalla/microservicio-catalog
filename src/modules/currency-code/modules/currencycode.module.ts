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
import { CurrencyCodeCommandController } from "../controllers/currencycodecommand.controller";
import { CurrencyCodeQueryController } from "../controllers/currencycodequery.controller";
import { CurrencyCodeCommandService } from "../services/currencycodecommand.service";
import { CurrencyCodeQueryService } from "../services/currencycodequery.service";

import { CurrencyCodeCommandRepository } from "../repositories/currencycodecommand.repository";
import { CurrencyCodeQueryRepository } from "../repositories/currencycodequery.repository";
import { CurrencyCodeRepository } from "../repositories/currencycode.repository";
import { CurrencyCodeResolver } from "../graphql/currencycode.resolver";
import { CurrencyCodeAuthGuard } from "../guards/currencycodeauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CurrencyCode } from "../entities/currency-code.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateCurrencyCodeHandler } from "../commands/handlers/createcurrencycode.handler";
import { UpdateCurrencyCodeHandler } from "../commands/handlers/updatecurrencycode.handler";
import { DeleteCurrencyCodeHandler } from "../commands/handlers/deletecurrencycode.handler";
import { GetCurrencyCodeByIdHandler } from "../queries/handlers/getcurrencycodebyid.handler";
import { GetCurrencyCodeByFieldHandler } from "../queries/handlers/getcurrencycodebyfield.handler";
import { GetAllCurrencyCodeHandler } from "../queries/handlers/getallcurrencycode.handler";
import { CurrencyCodeCrudSaga } from "../sagas/currencycode-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { CurrencyCodeInterceptor } from "../interceptors/currencycode.interceptor";
import { CurrencyCodeLoggingInterceptor } from "../interceptors/currencycode.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, CurrencyCode]), // Incluir BaseEntity para herencia
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
  controllers: [CurrencyCodeCommandController, CurrencyCodeQueryController],
  providers: [
    //Services
    EventStoreService,
    CurrencyCodeQueryService,
    CurrencyCodeCommandService,
  
    //Repositories
    CurrencyCodeCommandRepository,
    CurrencyCodeQueryRepository,
    CurrencyCodeRepository,      
    //Resolvers
    CurrencyCodeResolver,
    //Guards
    CurrencyCodeAuthGuard,
    //Interceptors
    CurrencyCodeInterceptor,
    CurrencyCodeLoggingInterceptor,
    //CQRS Handlers
    CreateCurrencyCodeHandler,
    UpdateCurrencyCodeHandler,
    DeleteCurrencyCodeHandler,
    GetCurrencyCodeByIdHandler,
    GetCurrencyCodeByFieldHandler,
    GetAllCurrencyCodeHandler,
    CurrencyCodeCrudSaga,
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
    CurrencyCodeQueryService,
    CurrencyCodeCommandService,
  
    //Repositories
    CurrencyCodeCommandRepository,
    CurrencyCodeQueryRepository,
    CurrencyCodeRepository,      
    //Resolvers
    CurrencyCodeResolver,
    //Guards
    CurrencyCodeAuthGuard,
    //Interceptors
    CurrencyCodeInterceptor,
    CurrencyCodeLoggingInterceptor,
  ],
})
export class CurrencyCodeModule {}

