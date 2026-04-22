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


import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
  Get,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { CatalogItemHistoryCommandService } from "../services/catalogitemhistorycommand.service";
import { CatalogItemHistoryAuthGuard } from "../guards/catalogitemhistoryauthguard.guard";

import { DeleteResult } from "typeorm";
import { Logger } from "@nestjs/common";
import { Helper } from "src/common/helpers/helpers";
import { CatalogItemHistory } from "../entities/catalog-item-history.entity";
import { CatalogItemHistoryResponse, CatalogItemHistorysResponse } from "../types/catalogitemhistory.types";
import { CreateCatalogItemHistoryDto, UpdateCatalogItemHistoryDto } from "../dtos/all-dto"; 

//Loggers
import { LoggerClient } from "src/common/logger/logger.client";
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { logger } from '@core/logs/logger';

import { BadRequestException } from "@nestjs/common";

import { CommandBus } from "@nestjs/cqrs";
//import { CatalogItemHistoryCreatedEvent } from "../events/catalogitemhistorycreated.event";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";

@ApiTags("CatalogItemHistory Command")
@UseGuards(CatalogItemHistoryAuthGuard)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: "Autenticación requerida." })
@Controller("catalogitemhistorys/command")
export class CatalogItemHistoryCommandController {

  #logger = new Logger(CatalogItemHistoryCommandController.name);

  //Constructor del controlador: CatalogItemHistoryCommandController
  constructor(
  private readonly service: CatalogItemHistoryCommandService,
  private readonly commandBus: CommandBus,
  private readonly eventStore: EventStoreService,
  private readonly eventPublisher: KafkaEventPublisher
  ) {
    //Coloca aquí la lógica que consideres necesaria para inicializar el controlador
  }

  @ApiOperation({ summary: "Create a new catalogitemhistory" })
  @ApiBody({ type: CreateCatalogItemHistoryDto })
  @ApiResponse({ status: 201, type: CatalogItemHistoryResponse<CatalogItemHistory> })
  @Post()
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(CatalogItemHistoryCommandController.name)
      .get(CatalogItemHistoryCommandController.name),
  })
  async create(
    @Body() createCatalogItemHistoryDtoInput: CreateCatalogItemHistoryDto
  ): Promise<CatalogItemHistoryResponse<CatalogItemHistory>> {
    try {
      logger.info("Receiving in controller:", createCatalogItemHistoryDtoInput);
      const entity = await this.service.create(createCatalogItemHistoryDtoInput);
      logger.info("Entity created on controller:", entity);
      if (!entity) {
        throw new NotFoundException("Response catalogitemhistory entity not found.");
      } else if (!entity.data) {
        throw new NotFoundException("CatalogItemHistory entity not found on response.");
      } else if (!entity.data.id) {
        throw new NotFoundException("Id catalogitemhistory is null on order instance.");
      }     

      return entity;
    } catch (error) {
      logger.info("Error creating entity on controller:", error);
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Create multiple catalogitemhistorys" })
  @ApiBody({ type: [CreateCatalogItemHistoryDto] })
  @ApiResponse({ status: 201, type: CatalogItemHistorysResponse<CatalogItemHistory> })
  @Post("bulk")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(CatalogItemHistoryCommandController.name)
      .get(CatalogItemHistoryCommandController.name),
  })
  async bulkCreate(
    @Body() createCatalogItemHistoryDtosInput: CreateCatalogItemHistoryDto[]
  ): Promise<CatalogItemHistorysResponse<CatalogItemHistory>> {
    try {
      const entities = await this.service.bulkCreate(createCatalogItemHistoryDtosInput);

      if (!entities) {
        throw new NotFoundException("CatalogItemHistory entities not found.");
      }

      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Update an catalogitemhistory" })
  @ApiParam({
    name: "id",
    description: "Identificador desde la url del endpoint",
  }) // ✅ Documentamos el ID de la URL
  @ApiBody({
    type: UpdateCatalogItemHistoryDto,
    description: "El Payload debe incluir el mismo ID de la URL",
  })
  @ApiResponse({ status: 200, type: CatalogItemHistoryResponse<CatalogItemHistory> })
  @ApiResponse({
    status: 400,
    description:
      "EL ID en la URL no coincide con la instancia CatalogItemHistory a actualizar.",
  }) // ✅ Nuevo status para el error de validación
  @Put(":id")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(CatalogItemHistoryCommandController.name)
      .get(CatalogItemHistoryCommandController.name),
  })
  async update(
    @Param("id") id: string,
    @Body() body: any
  ): Promise<CatalogItemHistoryResponse<CatalogItemHistory>> {
    try {
      // Permitir body plano o anidado en 'data'
      const partialEntity = body?.data ? body.data : body;
      // ✅ Validación de coincidencia de IDs
      if (id !== partialEntity.id) {
        throw new BadRequestException(
          "El ID en la URL no coincide con el ID en la instancia de CatalogItemHistory a actualizar."
        );
      }
      const entity = await this.service.update(id, partialEntity);

      if (!entity) {
        throw new NotFoundException("Instancia de CatalogItemHistory no encontrada.");
      }

      return entity;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Update multiple catalogitemhistorys" })
  @ApiBody({ type: [UpdateCatalogItemHistoryDto] })
  @ApiResponse({ status: 200, type: CatalogItemHistorysResponse<CatalogItemHistory> })
  @Put("bulk")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(CatalogItemHistoryCommandController.name)
      .get(CatalogItemHistoryCommandController.name),
  })
  async bulkUpdate(
    @Body() partialEntities: UpdateCatalogItemHistoryDto[]
  ): Promise<CatalogItemHistorysResponse<CatalogItemHistory>> {
    try {
      const entities = await this.service.bulkUpdate(partialEntities);

      if (!entities) {
        throw new NotFoundException("CatalogItemHistory entities not found.");
      }

      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Delete an catalogitemhistory" })   
  @ApiResponse({ status: 200, type: CatalogItemHistoryResponse<CatalogItemHistory>,description:
    "Instancia de CatalogItemHistory eliminada satisfactoriamente.", })
  @ApiResponse({
    status: 400,
    description:
      "EL ID en la URL no coincide con la instancia CatalogItemHistory a eliminar.",
  }) // ✅ Nuevo status para el error de validación
  @Delete(":id")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(CatalogItemHistoryCommandController.name)
      .get(CatalogItemHistoryCommandController.name),
  })
  async delete(@Param("id") id: string): Promise<CatalogItemHistoryResponse<CatalogItemHistory>> {
    try {
       
      const result = await this.service.delete(id);

      if (!result) {
        throw new NotFoundException("CatalogItemHistory entity not found.");
      }

      return result;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Delete multiple catalogitemhistorys" })
  @ApiResponse({ status: 200, type: DeleteResult })
  @Delete("bulk")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(CatalogItemHistoryCommandController.name)
      .get(CatalogItemHistoryCommandController.name),
  })
  async bulkDelete(@Query("ids") ids: string[]): Promise<DeleteResult> {
    return await this.service.bulkDelete(ids);
  }
}

