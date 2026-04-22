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
import { CatalogItem } from "../entities/catalog-item.entity";
import { CreateCatalogItemDto, UpdateCatalogItemDto, DeleteCatalogItemDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { CatalogItemCommandRepository } from "../repositories/catalogitemcommand.repository";
import { CatalogItemQueryRepository } from "../repositories/catalogitemquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { CatalogItemResponse, CatalogItemsResponse } from "../types/catalogitem.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { CatalogItemQueryService } from "./catalogitemquery.service";
import { BaseEvent } from "../events/base.event";


@Injectable()
export class CatalogItemCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(CatalogItemCommandService.name);
  //Constructo del servicio CatalogItemCommandService
  constructor(
    private readonly repository: CatalogItemCommandRepository,
    private readonly queryRepository: CatalogItemQueryRepository,
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
      .registerClient(CatalogItemQueryService.name)
      .get(CatalogItemQueryService.name),
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
        await this.eventStore.appendEvent('catalog-item-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: CatalogItem | null,
    current?: CatalogItem | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: item-requires-category
      // El ítem requiere categoryId.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'categoryId') === undefined || this.dslValue(entityData, currentData, inputData, 'categoryId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'categoryId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'categoryId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'categoryId')) && this.dslValue(entityData, currentData, inputData, 'categoryId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'categoryId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'categoryId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'categoryId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'categoryId'))).length === 0)))) {
        throw new Error('CAT_ITEM_001: categoryId requerido');
      }

      // Regla de servicio: item-requires-code
      // El ítem requiere itemCode.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'itemCode') === undefined || this.dslValue(entityData, currentData, inputData, 'itemCode') === null || (typeof this.dslValue(entityData, currentData, inputData, 'itemCode') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'itemCode')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'itemCode')) && this.dslValue(entityData, currentData, inputData, 'itemCode').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'itemCode') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'itemCode')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'itemCode')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'itemCode'))).length === 0)))) {
        throw new Error('CAT_ITEM_002: itemCode requerido');
      }

      // Regla de servicio: item-requires-label
      // El ítem requiere label por defecto.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'label') === undefined || this.dslValue(entityData, currentData, inputData, 'label') === null || (typeof this.dslValue(entityData, currentData, inputData, 'label') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'label')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'label')) && this.dslValue(entityData, currentData, inputData, 'label').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'label') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'label')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'label')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'label'))).length === 0)))) {
        throw new Error('CAT_ITEM_003: label requerido');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: item-requires-category
      // El ítem requiere categoryId.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'categoryId') === undefined || this.dslValue(entityData, currentData, inputData, 'categoryId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'categoryId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'categoryId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'categoryId')) && this.dslValue(entityData, currentData, inputData, 'categoryId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'categoryId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'categoryId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'categoryId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'categoryId'))).length === 0)))) {
        throw new Error('CAT_ITEM_001: categoryId requerido');
      }

      // Regla de servicio: item-requires-code
      // El ítem requiere itemCode.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'itemCode') === undefined || this.dslValue(entityData, currentData, inputData, 'itemCode') === null || (typeof this.dslValue(entityData, currentData, inputData, 'itemCode') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'itemCode')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'itemCode')) && this.dslValue(entityData, currentData, inputData, 'itemCode').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'itemCode') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'itemCode')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'itemCode')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'itemCode'))).length === 0)))) {
        throw new Error('CAT_ITEM_002: itemCode requerido');
      }

      // Regla de servicio: item-requires-label
      // El ítem requiere label por defecto.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'label') === undefined || this.dslValue(entityData, currentData, inputData, 'label') === null || (typeof this.dslValue(entityData, currentData, inputData, 'label') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'label')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'label')) && this.dslValue(entityData, currentData, inputData, 'label').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'label') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'label')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'label')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'label'))).length === 0)))) {
        throw new Error('CAT_ITEM_003: label requerido');
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
      .registerClient(CatalogItemCommandService.name)
      .get(CatalogItemCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateCatalogItemDto>("createCatalogItem", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createCatalogItemDtoInput: CreateCatalogItemDto
  ): Promise<CatalogItemResponse<CatalogItem>> {
    try {
      logger.info("Receiving in service:", createCatalogItemDtoInput);
      const candidate = CatalogItem.fromDto(createCatalogItemDtoInput);
      await this.applyDslServiceRules("create", createCatalogItemDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createCatalogItemDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el catalogitem no existe
      if (!entity)
        throw new NotFoundException("Entidad CatalogItem no encontrada.");
      // Devolver catalogitem
      return {
        ok: true,
        message: "CatalogItem obtenido con éxito.",
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
      .registerClient(CatalogItemCommandService.name)
      .get(CatalogItemCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CatalogItem>("createCatalogItems", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createCatalogItemDtosInput: CreateCatalogItemDto[]
  ): Promise<CatalogItemsResponse<CatalogItem>> {
    try {
      const entities = await this.repository.bulkCreate(
        createCatalogItemDtosInput.map((entity) => CatalogItem.fromDto(entity))
      );

      // Respuesta si el catalogitem no existe
      if (!entities)
        throw new NotFoundException("Entidades CatalogItems no encontradas.");
      // Devolver catalogitem
      return {
        ok: true,
        message: "CatalogItems creados con éxito.",
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
      .registerClient(CatalogItemCommandService.name)
      .get(CatalogItemCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateCatalogItemDto>("updateCatalogItem", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateCatalogItemDto
  ): Promise<CatalogItemResponse<CatalogItem>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new CatalogItem(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el catalogitem no existe
      if (!entity)
        throw new NotFoundException("Entidades CatalogItems no encontradas.");
      // Devolver catalogitem
      return {
        ok: true,
        message: "CatalogItem actualizada con éxito.",
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
      .registerClient(CatalogItemCommandService.name)
      .get(CatalogItemCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateCatalogItemDto>("updateCatalogItems", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateCatalogItemDto[]
  ): Promise<CatalogItemsResponse<CatalogItem>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => CatalogItem.fromDto(entity))
      );
      // Respuesta si el catalogitem no existe
      if (!entities)
        throw new NotFoundException("Entidades CatalogItems no encontradas.");
      // Devolver catalogitem
      return {
        ok: true,
        message: "CatalogItems actualizadas con éxito.",
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
      .registerClient(CatalogItemCommandService.name)
      .get(CatalogItemCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteCatalogItemDto>("deleteCatalogItem", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<CatalogItemResponse<CatalogItem>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el catalogitem no existe
      if (!entity)
        throw new NotFoundException("Instancias de CatalogItem no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver catalogitem
      return {
        ok: true,
        message: "Instancia de CatalogItem eliminada con éxito.",
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
      .registerClient(CatalogItemCommandService.name)
      .get(CatalogItemCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteCatalogItems", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

