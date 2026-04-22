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


import { Injectable, Logger, NotFoundException, OnModuleInit } from "@nestjs/common";
import { DeleteResult, UpdateResult } from "typeorm";
import { CatalogTranslation } from "../entities/catalog-translation.entity";
import { CreateCatalogTranslationDto, UpdateCatalogTranslationDto, DeleteCatalogTranslationDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { CatalogTranslationCommandRepository } from "../repositories/catalogtranslationcommand.repository";
import { CatalogTranslationQueryRepository } from "../repositories/catalogtranslationquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { CatalogTranslationResponse, CatalogTranslationsResponse } from "../types/catalogtranslation.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { CatalogTranslationQueryService } from "./catalogtranslationquery.service";
import { BaseEvent } from "../events/base.event";


@Injectable()
export class CatalogTranslationCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(CatalogTranslationCommandService.name);
  //Constructo del servicio CatalogTranslationCommandService
  constructor(
    private readonly repository: CatalogTranslationCommandRepository,
    private readonly queryRepository: CatalogTranslationQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly eventStore: EventStoreService,
    private readonly eventPublisher: KafkaEventPublisher,
    private moduleRef: ModuleRef
  ) {
    //Inicialice aquí propiedades o atributos
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(CatalogTranslationQueryService.name)
      .get(CatalogTranslationQueryService.name),
  })
  onModuleInit() {
    //Se ejecuta en la inicialización del módulo
  }

  private dslValue(entityData: Record<string, any>, currentData: Record<string, any>, inputData: Record<string, any>, field: string): any {
    return entityData?.[field] ?? currentData?.[field] ?? inputData?.[field];
  }

  private async publishDslDomainEvents(events: BaseEvent[]): Promise<void> {
    for (const event of events) {
      await this.eventPublisher.publish(event as any);
      if (process.env.EVENT_STORE_ENABLED === "true") {
        await this.eventStore.appendEvent('catalog-translation-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: CatalogTranslation | null,
    current?: CatalogTranslation | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: translation-requires-item
      // La traducción requiere catalogItemId.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'catalogItemId') === undefined || this.dslValue(entityData, currentData, inputData, 'catalogItemId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'catalogItemId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'catalogItemId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'catalogItemId')) && this.dslValue(entityData, currentData, inputData, 'catalogItemId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'catalogItemId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'catalogItemId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'catalogItemId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'catalogItemId'))).length === 0)))) {
        throw new Error('CAT_TR_001: catalogItemId requerido');
      }

      // Regla de servicio: translation-requires-locale
      // La traducción requiere locale.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'locale') === undefined || this.dslValue(entityData, currentData, inputData, 'locale') === null || (typeof this.dslValue(entityData, currentData, inputData, 'locale') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'locale')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'locale')) && this.dslValue(entityData, currentData, inputData, 'locale').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'locale') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'locale')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'locale')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'locale'))).length === 0)))) {
        throw new Error('CAT_TR_002: locale requerido');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: translation-requires-item
      // La traducción requiere catalogItemId.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'catalogItemId') === undefined || this.dslValue(entityData, currentData, inputData, 'catalogItemId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'catalogItemId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'catalogItemId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'catalogItemId')) && this.dslValue(entityData, currentData, inputData, 'catalogItemId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'catalogItemId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'catalogItemId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'catalogItemId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'catalogItemId'))).length === 0)))) {
        throw new Error('CAT_TR_001: catalogItemId requerido');
      }

      // Regla de servicio: translation-requires-locale
      // La traducción requiere locale.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'locale') === undefined || this.dslValue(entityData, currentData, inputData, 'locale') === null || (typeof this.dslValue(entityData, currentData, inputData, 'locale') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'locale')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'locale')) && this.dslValue(entityData, currentData, inputData, 'locale').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'locale') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'locale')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'locale')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'locale'))).length === 0)))) {
        throw new Error('CAT_TR_002: locale requerido');
      }

    }
    if (publishEvents) {
      await this.publishDslDomainEvents(pendingEvents);
    }
  }

  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(CatalogTranslationCommandService.name)
      .get(CatalogTranslationCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateCatalogTranslationDto>("createCatalogTranslation", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createCatalogTranslationDtoInput: CreateCatalogTranslationDto
  ): Promise<CatalogTranslationResponse<CatalogTranslation>> {
    try {
      logger.info("Receiving in service:", createCatalogTranslationDtoInput);
      const candidate = CatalogTranslation.fromDto(createCatalogTranslationDtoInput);
      await this.applyDslServiceRules("create", createCatalogTranslationDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createCatalogTranslationDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el catalogtranslation no existe
      if (!entity)
        throw new NotFoundException("Entidad CatalogTranslation no encontrada.");
      // Devolver catalogtranslation
      return {
        ok: true,
        message: "CatalogTranslation obtenido con éxito.",
        data: entity,
      };
    } catch (error) {
      logger.info("Error creating entity on service:", error);
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(CatalogTranslationCommandService.name)
      .get(CatalogTranslationCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CatalogTranslation>("createCatalogTranslations", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createCatalogTranslationDtosInput: CreateCatalogTranslationDto[]
  ): Promise<CatalogTranslationsResponse<CatalogTranslation>> {
    try {
      const entities = await this.repository.bulkCreate(
        createCatalogTranslationDtosInput.map((entity) => CatalogTranslation.fromDto(entity))
      );

      // Respuesta si el catalogtranslation no existe
      if (!entities)
        throw new NotFoundException("Entidades CatalogTranslations no encontradas.");
      // Devolver catalogtranslation
      return {
        ok: true,
        message: "CatalogTranslations creados con éxito.",
        data: entities,
        count: entities.length,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(CatalogTranslationCommandService.name)
      .get(CatalogTranslationCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateCatalogTranslationDto>("updateCatalogTranslation", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateCatalogTranslationDto
  ): Promise<CatalogTranslationResponse<CatalogTranslation>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new CatalogTranslation(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el catalogtranslation no existe
      if (!entity)
        throw new NotFoundException("Entidades CatalogTranslations no encontradas.");
      // Devolver catalogtranslation
      return {
        ok: true,
        message: "CatalogTranslation actualizada con éxito.",
        data: entity,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(CatalogTranslationCommandService.name)
      .get(CatalogTranslationCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateCatalogTranslationDto>("updateCatalogTranslations", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateCatalogTranslationDto[]
  ): Promise<CatalogTranslationsResponse<CatalogTranslation>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => CatalogTranslation.fromDto(entity))
      );
      // Respuesta si el catalogtranslation no existe
      if (!entities)
        throw new NotFoundException("Entidades CatalogTranslations no encontradas.");
      // Devolver catalogtranslation
      return {
        ok: true,
        message: "CatalogTranslations actualizadas con éxito.",
        data: entities,
        count: entities.length,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }

   @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(CatalogTranslationCommandService.name)
      .get(CatalogTranslationCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteCatalogTranslationDto>("deleteCatalogTranslation", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<CatalogTranslationResponse<CatalogTranslation>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el catalogtranslation no existe
      if (!entity)
        throw new NotFoundException("Instancias de CatalogTranslation no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver catalogtranslation
      return {
        ok: true,
        message: "Instancia de CatalogTranslation eliminada con éxito.",
        data: entity,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(CatalogTranslationCommandService.name)
      .get(CatalogTranslationCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteCatalogTranslations", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

