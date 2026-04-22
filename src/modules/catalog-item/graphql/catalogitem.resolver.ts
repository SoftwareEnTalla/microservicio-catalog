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


import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";

//Definición de entidades
import { CatalogItem } from "../entities/catalog-item.entity";

//Definición de comandos
import {
  CreateCatalogItemCommand,
  UpdateCatalogItemCommand,
  DeleteCatalogItemCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { CatalogItemQueryService } from "../services/catalogitemquery.service";


import { CatalogItemResponse, CatalogItemsResponse } from "../types/catalogitem.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateCatalogItemDto, 
CreateOrUpdateCatalogItemDto, 
CatalogItemValueInput, 
CatalogItemDto, 
CreateCatalogItemDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => CatalogItem)
export class CatalogItemResolver {

   //Constructor del resolver de CatalogItem
  constructor(
    private readonly service: CatalogItemQueryService,
    private readonly commandBus: CommandBus
  ) {}

  @LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(CatalogItemResolver.name)

      .get(CatalogItemResolver.name),
    })
  // Mutaciones
  @Mutation(() => CatalogItemResponse<CatalogItem>)
  async createCatalogItem(
    @Args("input", { type: () => CreateCatalogItemDto }) input: CreateCatalogItemDto
  ): Promise<CatalogItemResponse<CatalogItem>> {
    return this.commandBus.execute(new CreateCatalogItemCommand(input));
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(CatalogItemResolver.name)

      .get(CatalogItemResolver.name),
    })
  @Mutation(() => CatalogItemResponse<CatalogItem>)
  async updateCatalogItem(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateCatalogItemDto
  ): Promise<CatalogItemResponse<CatalogItem>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateCatalogItemCommand(payLoad, {
        instance: payLoad,
        metadata: {
          initiatedBy: payLoad.createdBy || 'system',
          correlationId: payLoad.id,
        },
      })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(CatalogItemResolver.name)

      .get(CatalogItemResolver.name),
    })
  @Mutation(() => CatalogItemResponse<CatalogItem>)
  async createOrUpdateCatalogItem(
    @Args("data", { type: () => CreateOrUpdateCatalogItemDto })
    data: CreateOrUpdateCatalogItemDto
  ): Promise<CatalogItemResponse<CatalogItem>> {
    if (data.id) {
      const existingCatalogItem = await this.service.findById(data.id);
      if (existingCatalogItem) {
        return this.commandBus.execute(
          new UpdateCatalogItemCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateCatalogItemDto | UpdateCatalogItemDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateCatalogItemCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateCatalogItemDto | UpdateCatalogItemDto).createdBy ||
            'system',
          correlationId: data.id || uuidv4(),
        },
      })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(CatalogItemResolver.name)

      .get(CatalogItemResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteCatalogItem(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteCatalogItemCommand(id));
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(CatalogItemResolver.name)

      .get(CatalogItemResolver.name),
    })
  // Queries
  @Query(() => CatalogItemsResponse<CatalogItem>)
  async catalogitems(
    options?: FindManyOptions<CatalogItem>,
    paginationArgs?: PaginationArgs
  ): Promise<CatalogItemsResponse<CatalogItem>> {
    return this.service.findAll(options, paginationArgs);
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(CatalogItemResolver.name)

      .get(CatalogItemResolver.name),
    })
  @Query(() => CatalogItemsResponse<CatalogItem>)
  async catalogitem(
    @Args("id", { type: () => String }) id: string
  ): Promise<CatalogItemResponse<CatalogItem>> {
    return this.service.findById(id);
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(CatalogItemResolver.name)

      .get(CatalogItemResolver.name),
    })
  @Query(() => CatalogItemsResponse<CatalogItem>)
  async catalogitemsByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => CatalogItemValueInput }) value: CatalogItemValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<CatalogItemsResponse<CatalogItem>> {
    return this.service.findByField(
      field,
      value,
      fromObject.call(PaginationArgs, { page: page, limit: limit })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(CatalogItemResolver.name)

      .get(CatalogItemResolver.name),
    })
  @Query(() => CatalogItemsResponse<CatalogItem>)
  async catalogitemsWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<CatalogItemsResponse<CatalogItem>> {
    const paginationArgs = fromObject.call(PaginationArgs, {
      page: page,
      limit: limit,
    });
    return this.service.findWithPagination({}, paginationArgs);
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(CatalogItemResolver.name)

      .get(CatalogItemResolver.name),
    })
  @Query(() => Number)
  async totalCatalogItems(): Promise<number> {
    return this.service.count();
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(CatalogItemResolver.name)

      .get(CatalogItemResolver.name),
    })
  @Query(() => CatalogItemsResponse<CatalogItem>)
  async searchCatalogItems(
    @Args("where", { type: () => CatalogItemDto, nullable: false })
    where: Record<string, any>
  ): Promise<CatalogItemsResponse<CatalogItem>> {
    const catalogitems = await this.service.findAndCount(where);
    return catalogitems;
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(CatalogItemResolver.name)

      .get(CatalogItemResolver.name),
    })
  @Query(() => CatalogItemResponse<CatalogItem>, { nullable: true })
  async findOneCatalogItem(
    @Args("where", { type: () => CatalogItemDto, nullable: false })
    where: Record<string, any>
  ): Promise<CatalogItemResponse<CatalogItem>> {
    return this.service.findOne(where);
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(CatalogItemResolver.name)

      .get(CatalogItemResolver.name),
    })
  @Query(() => CatalogItemResponse<CatalogItem>)
  async findOneCatalogItemOrFail(
    @Args("where", { type: () => CatalogItemDto, nullable: false })
    where: Record<string, any>
  ): Promise<CatalogItemResponse<CatalogItem> | Error> {
    return this.service.findOneOrFail(where);
  }
}

