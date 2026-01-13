/*
 * Copyright (c) 2025 SoftwarEnTalla
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
import { Catalog } from "../entities/catalog.entity";
import { CreateCatalogDto, UpdateCatalogDto, DeleteCatalogDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { CatalogCommandRepository } from "../repositories/catalogcommand.repository";
import { CatalogQueryRepository } from "../repositories/catalogquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { CatalogResponse, CatalogsResponse } from "../types/catalog.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { CatalogQueryService } from "./catalogquery.service";

@Injectable()
export class CatalogCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(CatalogCommandService.name);
  //Constructo del servicio CatalogCommandService
  constructor(
    private readonly repository: CatalogCommandRepository,
    private readonly queryRepository: CatalogQueryRepository,
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
      .registerClient(CatalogQueryService.name)
      .get(CatalogQueryService.name),
  })
  onModuleInit() {
    //Se ejecuta en la inicialización del módulo
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
      .registerClient(CatalogCommandService.name)
      .get(CatalogCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateCatalogDto>("createCatalog", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createCatalogDtoInput: CreateCatalogDto
  ): Promise<CatalogResponse<Catalog>> {
    try {
      logger.info("Receiving in service:", createCatalogDtoInput);
      const entity = await this.repository.create(
        Catalog.fromDto(createCatalogDtoInput)
      );
      logger.info("Entity created on service:", entity);
      // Respuesta si el catalog no existe
      if (!entity)
        throw new NotFoundException("Entidad Catalog no encontrada.");
      // Devolver catalog
      return {
        ok: true,
        message: "Catalog obtenido con éxito.",
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
      .registerClient(CatalogCommandService.name)
      .get(CatalogCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<Catalog>("createCatalogs", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createCatalogDtosInput: CreateCatalogDto[]
  ): Promise<CatalogsResponse<Catalog>> {
    try {
      const entities = await this.repository.bulkCreate(
        createCatalogDtosInput.map((entity) => Catalog.fromDto(entity))
      );

      // Respuesta si el catalog no existe
      if (!entities)
        throw new NotFoundException("Entidades Catalogs no encontradas.");
      // Devolver catalog
      return {
        ok: true,
        message: "Catalogs creados con éxito.",
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
      .registerClient(CatalogCommandService.name)
      .get(CatalogCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateCatalogDto>("updateCatalog", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateCatalogDto
  ): Promise<CatalogResponse<Catalog>> {
    try {
      const entity = await this.repository.update(
        id,
        Catalog.fromDto(partialEntity)
      );
      // Respuesta si el catalog no existe
      if (!entity)
        throw new NotFoundException("Entidades Catalogs no encontradas.");
      // Devolver catalog
      return {
        ok: true,
        message: "Catalog actualizada con éxito.",
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
      .registerClient(CatalogCommandService.name)
      .get(CatalogCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateCatalogDto>("updateCatalogs", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateCatalogDto[]
  ): Promise<CatalogsResponse<Catalog>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => Catalog.fromDto(entity))
      );
      // Respuesta si el catalog no existe
      if (!entities)
        throw new NotFoundException("Entidades Catalogs no encontradas.");
      // Devolver catalog
      return {
        ok: true,
        message: "Catalogs actualizadas con éxito.",
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
      .registerClient(CatalogCommandService.name)
      .get(CatalogCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteCatalogDto>("deleteCatalog", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<CatalogResponse<Catalog>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el catalog no existe
      if (!entity)
        throw new NotFoundException("Instancias de Catalog no encontradas.");

      const result = await this.repository.delete(id);
      // Devolver catalog
      return {
        ok: true,
        message: "Instancia de Catalog eliminada con éxito.",
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
      .registerClient(CatalogCommandService.name)
      .get(CatalogCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteCatalogs", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

