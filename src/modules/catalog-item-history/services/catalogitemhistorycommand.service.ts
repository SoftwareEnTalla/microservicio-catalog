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
import { CatalogItemHistory } from "../entities/catalog-item-history.entity";
import { CreateCatalogItemHistoryDto, UpdateCatalogItemHistoryDto, DeleteCatalogItemHistoryDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { CatalogItemHistoryCommandRepository } from "../repositories/catalogitemhistorycommand.repository";
import { CatalogItemHistoryQueryRepository } from "../repositories/catalogitemhistoryquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { CatalogItemHistoryResponse, CatalogItemHistorysResponse } from "../types/catalogitemhistory.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { CatalogItemHistoryQueryService } from "./catalogitemhistoryquery.service";
import { BaseEvent } from "../events/base.event";
import { CatalogItemVersionRecordedEvent } from '../events/catalogitemversionrecorded.event';

@Injectable()
export class CatalogItemHistoryCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(CatalogItemHistoryCommandService.name);
  //Constructo del servicio CatalogItemHistoryCommandService
  constructor(
    private readonly repository: CatalogItemHistoryCommandRepository,
    private readonly queryRepository: CatalogItemHistoryQueryRepository,
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
      .registerClient(CatalogItemHistoryQueryService.name)
      .get(CatalogItemHistoryQueryService.name),
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
        await this.eventStore.appendEvent('catalog-item-history-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: CatalogItemHistory | null,
    current?: CatalogItemHistory | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: history-requires-item
      // El histórico requiere catalogItemId.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'catalogItemId') === undefined || this.dslValue(entityData, currentData, inputData, 'catalogItemId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'catalogItemId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'catalogItemId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'catalogItemId')) && this.dslValue(entityData, currentData, inputData, 'catalogItemId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'catalogItemId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'catalogItemId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'catalogItemId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'catalogItemId'))).length === 0)))) {
        throw new Error('CAT_HIST_001: catalogItemId requerido');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: history-requires-item
      // El histórico requiere catalogItemId.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'catalogItemId') === undefined || this.dslValue(entityData, currentData, inputData, 'catalogItemId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'catalogItemId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'catalogItemId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'catalogItemId')) && this.dslValue(entityData, currentData, inputData, 'catalogItemId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'catalogItemId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'catalogItemId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'catalogItemId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'catalogItemId'))).length === 0)))) {
        throw new Error('CAT_HIST_001: catalogItemId requerido');
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
      .registerClient(CatalogItemHistoryCommandService.name)
      .get(CatalogItemHistoryCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateCatalogItemHistoryDto>("createCatalogItemHistory", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createCatalogItemHistoryDtoInput: CreateCatalogItemHistoryDto
  ): Promise<CatalogItemHistoryResponse<CatalogItemHistory>> {
    try {
      logger.info("Receiving in service:", createCatalogItemHistoryDtoInput);
      const candidate = CatalogItemHistory.fromDto(createCatalogItemHistoryDtoInput);
      await this.applyDslServiceRules("create", createCatalogItemHistoryDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createCatalogItemHistoryDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el catalogitemhistory no existe
      if (!entity)
        throw new NotFoundException("Entidad CatalogItemHistory no encontrada.");
      // Devolver catalogitemhistory
      return {
        ok: true,
        message: "CatalogItemHistory obtenido con éxito.",
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
      .registerClient(CatalogItemHistoryCommandService.name)
      .get(CatalogItemHistoryCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CatalogItemHistory>("createCatalogItemHistorys", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createCatalogItemHistoryDtosInput: CreateCatalogItemHistoryDto[]
  ): Promise<CatalogItemHistorysResponse<CatalogItemHistory>> {
    try {
      const entities = await this.repository.bulkCreate(
        createCatalogItemHistoryDtosInput.map((entity) => CatalogItemHistory.fromDto(entity))
      );

      // Respuesta si el catalogitemhistory no existe
      if (!entities)
        throw new NotFoundException("Entidades CatalogItemHistorys no encontradas.");
      // Devolver catalogitemhistory
      return {
        ok: true,
        message: "CatalogItemHistorys creados con éxito.",
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
      .registerClient(CatalogItemHistoryCommandService.name)
      .get(CatalogItemHistoryCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateCatalogItemHistoryDto>("updateCatalogItemHistory", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateCatalogItemHistoryDto
  ): Promise<CatalogItemHistoryResponse<CatalogItemHistory>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new CatalogItemHistory(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el catalogitemhistory no existe
      if (!entity)
        throw new NotFoundException("Entidades CatalogItemHistorys no encontradas.");
      // Devolver catalogitemhistory
      return {
        ok: true,
        message: "CatalogItemHistory actualizada con éxito.",
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
      .registerClient(CatalogItemHistoryCommandService.name)
      .get(CatalogItemHistoryCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateCatalogItemHistoryDto>("updateCatalogItemHistorys", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateCatalogItemHistoryDto[]
  ): Promise<CatalogItemHistorysResponse<CatalogItemHistory>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => CatalogItemHistory.fromDto(entity))
      );
      // Respuesta si el catalogitemhistory no existe
      if (!entities)
        throw new NotFoundException("Entidades CatalogItemHistorys no encontradas.");
      // Devolver catalogitemhistory
      return {
        ok: true,
        message: "CatalogItemHistorys actualizadas con éxito.",
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
      .registerClient(CatalogItemHistoryCommandService.name)
      .get(CatalogItemHistoryCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteCatalogItemHistoryDto>("deleteCatalogItemHistory", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<CatalogItemHistoryResponse<CatalogItemHistory>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el catalogitemhistory no existe
      if (!entity)
        throw new NotFoundException("Instancias de CatalogItemHistory no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver catalogitemhistory
      return {
        ok: true,
        message: "Instancia de CatalogItemHistory eliminada con éxito.",
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
      .registerClient(CatalogItemHistoryCommandService.name)
      .get(CatalogItemHistoryCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteCatalogItemHistorys", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

