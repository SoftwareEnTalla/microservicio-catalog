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
import { CatalogItemHistory } from "../entities/catalog-item-history.entity";

//Definición de comandos
import {
  CreateCatalogItemHistoryCommand,
  UpdateCatalogItemHistoryCommand,
  DeleteCatalogItemHistoryCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { CatalogItemHistoryQueryService } from "../services/catalogitemhistoryquery.service";


import { CatalogItemHistoryResponse, CatalogItemHistorysResponse } from "../types/catalogitemhistory.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateCatalogItemHistoryDto, 
CreateOrUpdateCatalogItemHistoryDto, 
CatalogItemHistoryValueInput, 
CatalogItemHistoryDto, 
CreateCatalogItemHistoryDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => CatalogItemHistory)
export class CatalogItemHistoryResolver {

   //Constructor del resolver de CatalogItemHistory
  constructor(
    private readonly service: CatalogItemHistoryQueryService,
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
      .registerClient(CatalogItemHistoryResolver.name)

      .get(CatalogItemHistoryResolver.name),
    })
  // Mutaciones
  @Mutation(() => CatalogItemHistoryResponse<CatalogItemHistory>)
  async createCatalogItemHistory(
    @Args("input", { type: () => CreateCatalogItemHistoryDto }) input: CreateCatalogItemHistoryDto
  ): Promise<CatalogItemHistoryResponse<CatalogItemHistory>> {
    return this.commandBus.execute(new CreateCatalogItemHistoryCommand(input));
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
      .registerClient(CatalogItemHistoryResolver.name)

      .get(CatalogItemHistoryResolver.name),
    })
  @Mutation(() => CatalogItemHistoryResponse<CatalogItemHistory>)
  async updateCatalogItemHistory(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateCatalogItemHistoryDto
  ): Promise<CatalogItemHistoryResponse<CatalogItemHistory>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateCatalogItemHistoryCommand(payLoad, {
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
      .registerClient(CatalogItemHistoryResolver.name)

      .get(CatalogItemHistoryResolver.name),
    })
  @Mutation(() => CatalogItemHistoryResponse<CatalogItemHistory>)
  async createOrUpdateCatalogItemHistory(
    @Args("data", { type: () => CreateOrUpdateCatalogItemHistoryDto })
    data: CreateOrUpdateCatalogItemHistoryDto
  ): Promise<CatalogItemHistoryResponse<CatalogItemHistory>> {
    if (data.id) {
      const existingCatalogItemHistory = await this.service.findById(data.id);
      if (existingCatalogItemHistory) {
        return this.commandBus.execute(
          new UpdateCatalogItemHistoryCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateCatalogItemHistoryDto | UpdateCatalogItemHistoryDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateCatalogItemHistoryCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateCatalogItemHistoryDto | UpdateCatalogItemHistoryDto).createdBy ||
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
      .registerClient(CatalogItemHistoryResolver.name)

      .get(CatalogItemHistoryResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteCatalogItemHistory(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteCatalogItemHistoryCommand(id));
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
      .registerClient(CatalogItemHistoryResolver.name)

      .get(CatalogItemHistoryResolver.name),
    })
  // Queries
  @Query(() => CatalogItemHistorysResponse<CatalogItemHistory>)
  async catalogitemhistorys(
    options?: FindManyOptions<CatalogItemHistory>,
    paginationArgs?: PaginationArgs
  ): Promise<CatalogItemHistorysResponse<CatalogItemHistory>> {
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
      .registerClient(CatalogItemHistoryResolver.name)

      .get(CatalogItemHistoryResolver.name),
    })
  @Query(() => CatalogItemHistorysResponse<CatalogItemHistory>)
  async catalogitemhistory(
    @Args("id", { type: () => String }) id: string
  ): Promise<CatalogItemHistoryResponse<CatalogItemHistory>> {
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
      .registerClient(CatalogItemHistoryResolver.name)

      .get(CatalogItemHistoryResolver.name),
    })
  @Query(() => CatalogItemHistorysResponse<CatalogItemHistory>)
  async catalogitemhistorysByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => CatalogItemHistoryValueInput }) value: CatalogItemHistoryValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<CatalogItemHistorysResponse<CatalogItemHistory>> {
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
      .registerClient(CatalogItemHistoryResolver.name)

      .get(CatalogItemHistoryResolver.name),
    })
  @Query(() => CatalogItemHistorysResponse<CatalogItemHistory>)
  async catalogitemhistorysWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<CatalogItemHistorysResponse<CatalogItemHistory>> {
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
      .registerClient(CatalogItemHistoryResolver.name)

      .get(CatalogItemHistoryResolver.name),
    })
  @Query(() => Number)
  async totalCatalogItemHistorys(): Promise<number> {
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
      .registerClient(CatalogItemHistoryResolver.name)

      .get(CatalogItemHistoryResolver.name),
    })
  @Query(() => CatalogItemHistorysResponse<CatalogItemHistory>)
  async searchCatalogItemHistorys(
    @Args("where", { type: () => CatalogItemHistoryDto, nullable: false })
    where: Record<string, any>
  ): Promise<CatalogItemHistorysResponse<CatalogItemHistory>> {
    const catalogitemhistorys = await this.service.findAndCount(where);
    return catalogitemhistorys;
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
      .registerClient(CatalogItemHistoryResolver.name)

      .get(CatalogItemHistoryResolver.name),
    })
  @Query(() => CatalogItemHistoryResponse<CatalogItemHistory>, { nullable: true })
  async findOneCatalogItemHistory(
    @Args("where", { type: () => CatalogItemHistoryDto, nullable: false })
    where: Record<string, any>
  ): Promise<CatalogItemHistoryResponse<CatalogItemHistory>> {
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
      .registerClient(CatalogItemHistoryResolver.name)

      .get(CatalogItemHistoryResolver.name),
    })
  @Query(() => CatalogItemHistoryResponse<CatalogItemHistory>)
  async findOneCatalogItemHistoryOrFail(
    @Args("where", { type: () => CatalogItemHistoryDto, nullable: false })
    where: Record<string, any>
  ): Promise<CatalogItemHistoryResponse<CatalogItemHistory> | Error> {
    return this.service.findOneOrFail(where);
  }
}

