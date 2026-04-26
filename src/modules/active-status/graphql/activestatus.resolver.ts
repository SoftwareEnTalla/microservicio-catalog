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
import { ActiveStatus } from "../entities/active-status.entity";

//Definición de comandos
import {
  CreateActiveStatusCommand,
  UpdateActiveStatusCommand,
  DeleteActiveStatusCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { ActiveStatusQueryService } from "../services/activestatusquery.service";


import { ActiveStatusResponse, ActiveStatussResponse } from "../types/activestatus.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateActiveStatusDto, 
CreateOrUpdateActiveStatusDto, 
ActiveStatusValueInput, 
ActiveStatusDto, 
CreateActiveStatusDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => ActiveStatus)
export class ActiveStatusResolver {

   //Constructor del resolver de ActiveStatus
  constructor(
    private readonly service: ActiveStatusQueryService,
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
      .registerClient(ActiveStatusResolver.name)

      .get(ActiveStatusResolver.name),
    })
  // Mutaciones
  @Mutation(() => ActiveStatusResponse<ActiveStatus>)
  async createActiveStatus(
    @Args("input", { type: () => CreateActiveStatusDto }) input: CreateActiveStatusDto
  ): Promise<ActiveStatusResponse<ActiveStatus>> {
    return this.commandBus.execute(new CreateActiveStatusCommand(input));
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
      .registerClient(ActiveStatusResolver.name)

      .get(ActiveStatusResolver.name),
    })
  @Mutation(() => ActiveStatusResponse<ActiveStatus>)
  async updateActiveStatus(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateActiveStatusDto
  ): Promise<ActiveStatusResponse<ActiveStatus>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateActiveStatusCommand(payLoad, {
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
      .registerClient(ActiveStatusResolver.name)

      .get(ActiveStatusResolver.name),
    })
  @Mutation(() => ActiveStatusResponse<ActiveStatus>)
  async createOrUpdateActiveStatus(
    @Args("data", { type: () => CreateOrUpdateActiveStatusDto })
    data: CreateOrUpdateActiveStatusDto
  ): Promise<ActiveStatusResponse<ActiveStatus>> {
    if (data.id) {
      const existingActiveStatus = await this.service.findById(data.id);
      if (existingActiveStatus) {
        return this.commandBus.execute(
          new UpdateActiveStatusCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateActiveStatusDto | UpdateActiveStatusDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateActiveStatusCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateActiveStatusDto | UpdateActiveStatusDto).createdBy ||
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
      .registerClient(ActiveStatusResolver.name)

      .get(ActiveStatusResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteActiveStatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteActiveStatusCommand(id));
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
      .registerClient(ActiveStatusResolver.name)

      .get(ActiveStatusResolver.name),
    })
  // Queries
  @Query(() => ActiveStatussResponse<ActiveStatus>)
  async activestatuss(
    options?: FindManyOptions<ActiveStatus>,
    paginationArgs?: PaginationArgs
  ): Promise<ActiveStatussResponse<ActiveStatus>> {
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
      .registerClient(ActiveStatusResolver.name)

      .get(ActiveStatusResolver.name),
    })
  @Query(() => ActiveStatussResponse<ActiveStatus>)
  async activestatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<ActiveStatusResponse<ActiveStatus>> {
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
      .registerClient(ActiveStatusResolver.name)

      .get(ActiveStatusResolver.name),
    })
  @Query(() => ActiveStatussResponse<ActiveStatus>)
  async activestatussByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => ActiveStatusValueInput }) value: ActiveStatusValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ActiveStatussResponse<ActiveStatus>> {
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
      .registerClient(ActiveStatusResolver.name)

      .get(ActiveStatusResolver.name),
    })
  @Query(() => ActiveStatussResponse<ActiveStatus>)
  async activestatussWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ActiveStatussResponse<ActiveStatus>> {
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
      .registerClient(ActiveStatusResolver.name)

      .get(ActiveStatusResolver.name),
    })
  @Query(() => Number)
  async totalActiveStatuss(): Promise<number> {
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
      .registerClient(ActiveStatusResolver.name)

      .get(ActiveStatusResolver.name),
    })
  @Query(() => ActiveStatussResponse<ActiveStatus>)
  async searchActiveStatuss(
    @Args("where", { type: () => ActiveStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<ActiveStatussResponse<ActiveStatus>> {
    const activestatuss = await this.service.findAndCount(where);
    return activestatuss;
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
      .registerClient(ActiveStatusResolver.name)

      .get(ActiveStatusResolver.name),
    })
  @Query(() => ActiveStatusResponse<ActiveStatus>, { nullable: true })
  async findOneActiveStatus(
    @Args("where", { type: () => ActiveStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<ActiveStatusResponse<ActiveStatus>> {
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
      .registerClient(ActiveStatusResolver.name)

      .get(ActiveStatusResolver.name),
    })
  @Query(() => ActiveStatusResponse<ActiveStatus>)
  async findOneActiveStatusOrFail(
    @Args("where", { type: () => ActiveStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<ActiveStatusResponse<ActiveStatus> | Error> {
    return this.service.findOneOrFail(where);
  }
}

