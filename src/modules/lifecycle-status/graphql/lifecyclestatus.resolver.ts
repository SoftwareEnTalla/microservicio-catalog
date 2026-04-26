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
import { LifecycleStatus } from "../entities/lifecycle-status.entity";

//Definición de comandos
import {
  CreateLifecycleStatusCommand,
  UpdateLifecycleStatusCommand,
  DeleteLifecycleStatusCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { LifecycleStatusQueryService } from "../services/lifecyclestatusquery.service";


import { LifecycleStatusResponse, LifecycleStatussResponse } from "../types/lifecyclestatus.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateLifecycleStatusDto, 
CreateOrUpdateLifecycleStatusDto, 
LifecycleStatusValueInput, 
LifecycleStatusDto, 
CreateLifecycleStatusDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => LifecycleStatus)
export class LifecycleStatusResolver {

   //Constructor del resolver de LifecycleStatus
  constructor(
    private readonly service: LifecycleStatusQueryService,
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
      .registerClient(LifecycleStatusResolver.name)

      .get(LifecycleStatusResolver.name),
    })
  // Mutaciones
  @Mutation(() => LifecycleStatusResponse<LifecycleStatus>)
  async createLifecycleStatus(
    @Args("input", { type: () => CreateLifecycleStatusDto }) input: CreateLifecycleStatusDto
  ): Promise<LifecycleStatusResponse<LifecycleStatus>> {
    return this.commandBus.execute(new CreateLifecycleStatusCommand(input));
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
      .registerClient(LifecycleStatusResolver.name)

      .get(LifecycleStatusResolver.name),
    })
  @Mutation(() => LifecycleStatusResponse<LifecycleStatus>)
  async updateLifecycleStatus(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateLifecycleStatusDto
  ): Promise<LifecycleStatusResponse<LifecycleStatus>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateLifecycleStatusCommand(payLoad, {
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
      .registerClient(LifecycleStatusResolver.name)

      .get(LifecycleStatusResolver.name),
    })
  @Mutation(() => LifecycleStatusResponse<LifecycleStatus>)
  async createOrUpdateLifecycleStatus(
    @Args("data", { type: () => CreateOrUpdateLifecycleStatusDto })
    data: CreateOrUpdateLifecycleStatusDto
  ): Promise<LifecycleStatusResponse<LifecycleStatus>> {
    if (data.id) {
      const existingLifecycleStatus = await this.service.findById(data.id);
      if (existingLifecycleStatus) {
        return this.commandBus.execute(
          new UpdateLifecycleStatusCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateLifecycleStatusDto | UpdateLifecycleStatusDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateLifecycleStatusCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateLifecycleStatusDto | UpdateLifecycleStatusDto).createdBy ||
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
      .registerClient(LifecycleStatusResolver.name)

      .get(LifecycleStatusResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteLifecycleStatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteLifecycleStatusCommand(id));
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
      .registerClient(LifecycleStatusResolver.name)

      .get(LifecycleStatusResolver.name),
    })
  // Queries
  @Query(() => LifecycleStatussResponse<LifecycleStatus>)
  async lifecyclestatuss(
    options?: FindManyOptions<LifecycleStatus>,
    paginationArgs?: PaginationArgs
  ): Promise<LifecycleStatussResponse<LifecycleStatus>> {
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
      .registerClient(LifecycleStatusResolver.name)

      .get(LifecycleStatusResolver.name),
    })
  @Query(() => LifecycleStatussResponse<LifecycleStatus>)
  async lifecyclestatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<LifecycleStatusResponse<LifecycleStatus>> {
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
      .registerClient(LifecycleStatusResolver.name)

      .get(LifecycleStatusResolver.name),
    })
  @Query(() => LifecycleStatussResponse<LifecycleStatus>)
  async lifecyclestatussByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => LifecycleStatusValueInput }) value: LifecycleStatusValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<LifecycleStatussResponse<LifecycleStatus>> {
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
      .registerClient(LifecycleStatusResolver.name)

      .get(LifecycleStatusResolver.name),
    })
  @Query(() => LifecycleStatussResponse<LifecycleStatus>)
  async lifecyclestatussWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<LifecycleStatussResponse<LifecycleStatus>> {
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
      .registerClient(LifecycleStatusResolver.name)

      .get(LifecycleStatusResolver.name),
    })
  @Query(() => Number)
  async totalLifecycleStatuss(): Promise<number> {
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
      .registerClient(LifecycleStatusResolver.name)

      .get(LifecycleStatusResolver.name),
    })
  @Query(() => LifecycleStatussResponse<LifecycleStatus>)
  async searchLifecycleStatuss(
    @Args("where", { type: () => LifecycleStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<LifecycleStatussResponse<LifecycleStatus>> {
    const lifecyclestatuss = await this.service.findAndCount(where);
    return lifecyclestatuss;
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
      .registerClient(LifecycleStatusResolver.name)

      .get(LifecycleStatusResolver.name),
    })
  @Query(() => LifecycleStatusResponse<LifecycleStatus>, { nullable: true })
  async findOneLifecycleStatus(
    @Args("where", { type: () => LifecycleStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<LifecycleStatusResponse<LifecycleStatus>> {
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
      .registerClient(LifecycleStatusResolver.name)

      .get(LifecycleStatusResolver.name),
    })
  @Query(() => LifecycleStatusResponse<LifecycleStatus>)
  async findOneLifecycleStatusOrFail(
    @Args("where", { type: () => LifecycleStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<LifecycleStatusResponse<LifecycleStatus> | Error> {
    return this.service.findOneOrFail(where);
  }
}

