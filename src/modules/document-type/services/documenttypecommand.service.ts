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
import { DocumentType } from "../entities/document-type.entity";
import { CreateDocumentTypeDto, UpdateDocumentTypeDto, DeleteDocumentTypeDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { DocumentTypeCommandRepository } from "../repositories/documenttypecommand.repository";
import { DocumentTypeQueryRepository } from "../repositories/documenttypequery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { DocumentTypeResponse, DocumentTypesResponse } from "../types/documenttype.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { DocumentTypeQueryService } from "./documenttypequery.service";
import { BaseEvent } from "../events/base.event";


@Injectable()
export class DocumentTypeCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(DocumentTypeCommandService.name);
  //Constructo del servicio DocumentTypeCommandService
  constructor(
    private readonly repository: DocumentTypeCommandRepository,
    private readonly queryRepository: DocumentTypeQueryRepository,
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
      .registerClient(DocumentTypeQueryService.name)
      .get(DocumentTypeQueryService.name),
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
        await this.eventStore.appendEvent('document-type-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: DocumentType | null,
    current?: DocumentType | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
// No se definieron business-rules target=service.
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
      .registerClient(DocumentTypeCommandService.name)
      .get(DocumentTypeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateDocumentTypeDto>("createDocumentType", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createDocumentTypeDtoInput: CreateDocumentTypeDto
  ): Promise<DocumentTypeResponse<DocumentType>> {
    try {
      logger.info("Receiving in service:", createDocumentTypeDtoInput);
      const candidate = DocumentType.fromDto(createDocumentTypeDtoInput);
      await this.applyDslServiceRules("create", createDocumentTypeDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createDocumentTypeDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el documenttype no existe
      if (!entity)
        throw new NotFoundException("Entidad DocumentType no encontrada.");
      // Devolver documenttype
      return {
        ok: true,
        message: "DocumentType obtenido con éxito.",
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
      .registerClient(DocumentTypeCommandService.name)
      .get(DocumentTypeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DocumentType>("createDocumentTypes", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createDocumentTypeDtosInput: CreateDocumentTypeDto[]
  ): Promise<DocumentTypesResponse<DocumentType>> {
    try {
      const entities = await this.repository.bulkCreate(
        createDocumentTypeDtosInput.map((entity) => DocumentType.fromDto(entity))
      );

      // Respuesta si el documenttype no existe
      if (!entities)
        throw new NotFoundException("Entidades DocumentTypes no encontradas.");
      // Devolver documenttype
      return {
        ok: true,
        message: "DocumentTypes creados con éxito.",
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
      .registerClient(DocumentTypeCommandService.name)
      .get(DocumentTypeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateDocumentTypeDto>("updateDocumentType", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateDocumentTypeDto
  ): Promise<DocumentTypeResponse<DocumentType>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new DocumentType(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el documenttype no existe
      if (!entity)
        throw new NotFoundException("Entidades DocumentTypes no encontradas.");
      // Devolver documenttype
      return {
        ok: true,
        message: "DocumentType actualizada con éxito.",
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
      .registerClient(DocumentTypeCommandService.name)
      .get(DocumentTypeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateDocumentTypeDto>("updateDocumentTypes", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateDocumentTypeDto[]
  ): Promise<DocumentTypesResponse<DocumentType>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => DocumentType.fromDto(entity))
      );
      // Respuesta si el documenttype no existe
      if (!entities)
        throw new NotFoundException("Entidades DocumentTypes no encontradas.");
      // Devolver documenttype
      return {
        ok: true,
        message: "DocumentTypes actualizadas con éxito.",
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
      .registerClient(DocumentTypeCommandService.name)
      .get(DocumentTypeCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteDocumentTypeDto>("deleteDocumentType", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<DocumentTypeResponse<DocumentType>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el documenttype no existe
      if (!entity)
        throw new NotFoundException("Instancias de DocumentType no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver documenttype
      return {
        ok: true,
        message: "Instancia de DocumentType eliminada con éxito.",
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
      .registerClient(DocumentTypeCommandService.name)
      .get(DocumentTypeCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteDocumentTypes", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

