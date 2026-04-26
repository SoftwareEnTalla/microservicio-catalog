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
import { UpstreamSyncStatus } from "../entities/upstream-sync-status.entity";

//Definición de comandos
import {
  CreateUpstreamSyncStatusCommand,
  UpdateUpstreamSyncStatusCommand,
  DeleteUpstreamSyncStatusCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { UpstreamSyncStatusQueryService } from "../services/upstreamsyncstatusquery.service";


import { UpstreamSyncStatusResponse, UpstreamSyncStatussResponse } from "../types/upstreamsyncstatus.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateUpstreamSyncStatusDto, 
CreateOrUpdateUpstreamSyncStatusDto, 
UpstreamSyncStatusValueInput, 
UpstreamSyncStatusDto, 
CreateUpstreamSyncStatusDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => UpstreamSyncStatus)
export class UpstreamSyncStatusResolver {

   //Constructor del resolver de UpstreamSyncStatus
  constructor(
    private readonly service: UpstreamSyncStatusQueryService,
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
      .registerClient(UpstreamSyncStatusResolver.name)

      .get(UpstreamSyncStatusResolver.name),
    })
  // Mutaciones
  @Mutation(() => UpstreamSyncStatusResponse<UpstreamSyncStatus>)
  async createUpstreamSyncStatus(
    @Args("input", { type: () => CreateUpstreamSyncStatusDto }) input: CreateUpstreamSyncStatusDto
  ): Promise<UpstreamSyncStatusResponse<UpstreamSyncStatus>> {
    return this.commandBus.execute(new CreateUpstreamSyncStatusCommand(input));
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
      .registerClient(UpstreamSyncStatusResolver.name)

      .get(UpstreamSyncStatusResolver.name),
    })
  @Mutation(() => UpstreamSyncStatusResponse<UpstreamSyncStatus>)
  async updateUpstreamSyncStatus(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateUpstreamSyncStatusDto
  ): Promise<UpstreamSyncStatusResponse<UpstreamSyncStatus>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateUpstreamSyncStatusCommand(payLoad, {
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
      .registerClient(UpstreamSyncStatusResolver.name)

      .get(UpstreamSyncStatusResolver.name),
    })
  @Mutation(() => UpstreamSyncStatusResponse<UpstreamSyncStatus>)
  async createOrUpdateUpstreamSyncStatus(
    @Args("data", { type: () => CreateOrUpdateUpstreamSyncStatusDto })
    data: CreateOrUpdateUpstreamSyncStatusDto
  ): Promise<UpstreamSyncStatusResponse<UpstreamSyncStatus>> {
    if (data.id) {
      const existingUpstreamSyncStatus = await this.service.findById(data.id);
      if (existingUpstreamSyncStatus) {
        return this.commandBus.execute(
          new UpdateUpstreamSyncStatusCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateUpstreamSyncStatusDto | UpdateUpstreamSyncStatusDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateUpstreamSyncStatusCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateUpstreamSyncStatusDto | UpdateUpstreamSyncStatusDto).createdBy ||
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
      .registerClient(UpstreamSyncStatusResolver.name)

      .get(UpstreamSyncStatusResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteUpstreamSyncStatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteUpstreamSyncStatusCommand(id));
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
      .registerClient(UpstreamSyncStatusResolver.name)

      .get(UpstreamSyncStatusResolver.name),
    })
  // Queries
  @Query(() => UpstreamSyncStatussResponse<UpstreamSyncStatus>)
  async upstreamsyncstatuss(
    options?: FindManyOptions<UpstreamSyncStatus>,
    paginationArgs?: PaginationArgs
  ): Promise<UpstreamSyncStatussResponse<UpstreamSyncStatus>> {
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
      .registerClient(UpstreamSyncStatusResolver.name)

      .get(UpstreamSyncStatusResolver.name),
    })
  @Query(() => UpstreamSyncStatussResponse<UpstreamSyncStatus>)
  async upstreamsyncstatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<UpstreamSyncStatusResponse<UpstreamSyncStatus>> {
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
      .registerClient(UpstreamSyncStatusResolver.name)

      .get(UpstreamSyncStatusResolver.name),
    })
  @Query(() => UpstreamSyncStatussResponse<UpstreamSyncStatus>)
  async upstreamsyncstatussByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => UpstreamSyncStatusValueInput }) value: UpstreamSyncStatusValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<UpstreamSyncStatussResponse<UpstreamSyncStatus>> {
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
      .registerClient(UpstreamSyncStatusResolver.name)

      .get(UpstreamSyncStatusResolver.name),
    })
  @Query(() => UpstreamSyncStatussResponse<UpstreamSyncStatus>)
  async upstreamsyncstatussWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<UpstreamSyncStatussResponse<UpstreamSyncStatus>> {
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
      .registerClient(UpstreamSyncStatusResolver.name)

      .get(UpstreamSyncStatusResolver.name),
    })
  @Query(() => Number)
  async totalUpstreamSyncStatuss(): Promise<number> {
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
      .registerClient(UpstreamSyncStatusResolver.name)

      .get(UpstreamSyncStatusResolver.name),
    })
  @Query(() => UpstreamSyncStatussResponse<UpstreamSyncStatus>)
  async searchUpstreamSyncStatuss(
    @Args("where", { type: () => UpstreamSyncStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<UpstreamSyncStatussResponse<UpstreamSyncStatus>> {
    const upstreamsyncstatuss = await this.service.findAndCount(where);
    return upstreamsyncstatuss;
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
      .registerClient(UpstreamSyncStatusResolver.name)

      .get(UpstreamSyncStatusResolver.name),
    })
  @Query(() => UpstreamSyncStatusResponse<UpstreamSyncStatus>, { nullable: true })
  async findOneUpstreamSyncStatus(
    @Args("where", { type: () => UpstreamSyncStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<UpstreamSyncStatusResponse<UpstreamSyncStatus>> {
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
      .registerClient(UpstreamSyncStatusResolver.name)

      .get(UpstreamSyncStatusResolver.name),
    })
  @Query(() => UpstreamSyncStatusResponse<UpstreamSyncStatus>)
  async findOneUpstreamSyncStatusOrFail(
    @Args("where", { type: () => UpstreamSyncStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<UpstreamSyncStatusResponse<UpstreamSyncStatus> | Error> {
    return this.service.findOneOrFail(where);
  }
}

