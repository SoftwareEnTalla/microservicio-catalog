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
import { CatalogCategory } from "../entities/catalog-category.entity";
import { CreateCatalogCategoryDto, UpdateCatalogCategoryDto, DeleteCatalogCategoryDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { CatalogCategoryCommandRepository } from "../repositories/catalogcategorycommand.repository";
import { CatalogCategoryQueryRepository } from "../repositories/catalogcategoryquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { CatalogCategoryResponse, CatalogCategorysResponse } from "../types/catalogcategory.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { CatalogCategoryQueryService } from "./catalogcategoryquery.service";
import { BaseEvent } from "../events/base.event";
import { CatalogCategoryDeprecatedEvent } from '../events/catalogcategorydeprecated.event';

@Injectable()
export class CatalogCategoryCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(CatalogCategoryCommandService.name);
  //Constructo del servicio CatalogCategoryCommandService
  constructor(
    private readonly repository: CatalogCategoryCommandRepository,
    private readonly queryRepository: CatalogCategoryQueryRepository,
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
      .registerClient(CatalogCategoryQueryService.name)
      .get(CatalogCategoryQueryService.name),
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
        await this.eventStore.appendEvent('catalog-category-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: CatalogCategory | null,
    current?: CatalogCategory | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: category-requires-code
      // La categoría requiere categoryCode.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'categoryCode') === undefined || this.dslValue(entityData, currentData, inputData, 'categoryCode') === null || (typeof this.dslValue(entityData, currentData, inputData, 'categoryCode') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'categoryCode')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'categoryCode')) && this.dslValue(entityData, currentData, inputData, 'categoryCode').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'categoryCode') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'categoryCode')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'categoryCode')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'categoryCode'))).length === 0)))) {
        throw new Error('CAT_CAT_001: categoryCode requerido');
      }

      // Regla de servicio: category-requires-name
      // La categoría requiere name.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'name') === undefined || this.dslValue(entityData, currentData, inputData, 'name') === null || (typeof this.dslValue(entityData, currentData, inputData, 'name') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'name')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'name')) && this.dslValue(entityData, currentData, inputData, 'name').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'name') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'name')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'name')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'name'))).length === 0)))) {
        throw new Error('CAT_CAT_002: name requerido');
      }

      // Regla de servicio: category-requires-owner
      // La categoría requiere ownerService.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'ownerService') === undefined || this.dslValue(entityData, currentData, inputData, 'ownerService') === null || (typeof this.dslValue(entityData, currentData, inputData, 'ownerService') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'ownerService')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'ownerService')) && this.dslValue(entityData, currentData, inputData, 'ownerService').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'ownerService') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'ownerService')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'ownerService')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'ownerService'))).length === 0)))) {
        throw new Error('CAT_CAT_003: ownerService requerido');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: category-requires-code
      // La categoría requiere categoryCode.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'categoryCode') === undefined || this.dslValue(entityData, currentData, inputData, 'categoryCode') === null || (typeof this.dslValue(entityData, currentData, inputData, 'categoryCode') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'categoryCode')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'categoryCode')) && this.dslValue(entityData, currentData, inputData, 'categoryCode').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'categoryCode') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'categoryCode')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'categoryCode')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'categoryCode'))).length === 0)))) {
        throw new Error('CAT_CAT_001: categoryCode requerido');
      }

      // Regla de servicio: category-requires-name
      // La categoría requiere name.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'name') === undefined || this.dslValue(entityData, currentData, inputData, 'name') === null || (typeof this.dslValue(entityData, currentData, inputData, 'name') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'name')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'name')) && this.dslValue(entityData, currentData, inputData, 'name').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'name') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'name')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'name')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'name'))).length === 0)))) {
        throw new Error('CAT_CAT_002: name requerido');
      }

      // Regla de servicio: category-requires-owner
      // La categoría requiere ownerService.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'ownerService') === undefined || this.dslValue(entityData, currentData, inputData, 'ownerService') === null || (typeof this.dslValue(entityData, currentData, inputData, 'ownerService') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'ownerService')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'ownerService')) && this.dslValue(entityData, currentData, inputData, 'ownerService').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'ownerService') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'ownerService')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'ownerService')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'ownerService'))).length === 0)))) {
        throw new Error('CAT_CAT_003: ownerService requerido');
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
      .registerClient(CatalogCategoryCommandService.name)
      .get(CatalogCategoryCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateCatalogCategoryDto>("createCatalogCategory", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createCatalogCategoryDtoInput: CreateCatalogCategoryDto
  ): Promise<CatalogCategoryResponse<CatalogCategory>> {
    try {
      logger.info("Receiving in service:", createCatalogCategoryDtoInput);
      const candidate = CatalogCategory.fromDto(createCatalogCategoryDtoInput);
      await this.applyDslServiceRules("create", createCatalogCategoryDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createCatalogCategoryDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el catalogcategory no existe
      if (!entity)
        throw new NotFoundException("Entidad CatalogCategory no encontrada.");
      // Devolver catalogcategory
      return {
        ok: true,
        message: "CatalogCategory obtenido con éxito.",
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
      .registerClient(CatalogCategoryCommandService.name)
      .get(CatalogCategoryCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CatalogCategory>("createCatalogCategorys", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createCatalogCategoryDtosInput: CreateCatalogCategoryDto[]
  ): Promise<CatalogCategorysResponse<CatalogCategory>> {
    try {
      const entities = await this.repository.bulkCreate(
        createCatalogCategoryDtosInput.map((entity) => CatalogCategory.fromDto(entity))
      );

      // Respuesta si el catalogcategory no existe
      if (!entities)
        throw new NotFoundException("Entidades CatalogCategorys no encontradas.");
      // Devolver catalogcategory
      return {
        ok: true,
        message: "CatalogCategorys creados con éxito.",
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
      .registerClient(CatalogCategoryCommandService.name)
      .get(CatalogCategoryCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateCatalogCategoryDto>("updateCatalogCategory", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateCatalogCategoryDto
  ): Promise<CatalogCategoryResponse<CatalogCategory>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new CatalogCategory(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el catalogcategory no existe
      if (!entity)
        throw new NotFoundException("Entidades CatalogCategorys no encontradas.");
      // Devolver catalogcategory
      return {
        ok: true,
        message: "CatalogCategory actualizada con éxito.",
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
      .registerClient(CatalogCategoryCommandService.name)
      .get(CatalogCategoryCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateCatalogCategoryDto>("updateCatalogCategorys", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateCatalogCategoryDto[]
  ): Promise<CatalogCategorysResponse<CatalogCategory>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => CatalogCategory.fromDto(entity))
      );
      // Respuesta si el catalogcategory no existe
      if (!entities)
        throw new NotFoundException("Entidades CatalogCategorys no encontradas.");
      // Devolver catalogcategory
      return {
        ok: true,
        message: "CatalogCategorys actualizadas con éxito.",
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
      .registerClient(CatalogCategoryCommandService.name)
      .get(CatalogCategoryCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteCatalogCategoryDto>("deleteCatalogCategory", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<CatalogCategoryResponse<CatalogCategory>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el catalogcategory no existe
      if (!entity)
        throw new NotFoundException("Instancias de CatalogCategory no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver catalogcategory
      return {
        ok: true,
        message: "Instancia de CatalogCategory eliminada con éxito.",
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
      .registerClient(CatalogCategoryCommandService.name)
      .get(CatalogCategoryCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteCatalogCategorys", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

