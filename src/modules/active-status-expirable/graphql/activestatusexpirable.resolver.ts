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
import { ActiveStatusExpirable } from "../entities/active-status-expirable.entity";

//Definición de comandos
import {
  CreateActiveStatusExpirableCommand,
  UpdateActiveStatusExpirableCommand,
  DeleteActiveStatusExpirableCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { ActiveStatusExpirableQueryService } from "../services/activestatusexpirablequery.service";


import { ActiveStatusExpirableResponse, ActiveStatusExpirablesResponse } from "../types/activestatusexpirable.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateActiveStatusExpirableDto, 
CreateOrUpdateActiveStatusExpirableDto, 
ActiveStatusExpirableValueInput, 
ActiveStatusExpirableDto, 
CreateActiveStatusExpirableDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => ActiveStatusExpirable)
export class ActiveStatusExpirableResolver {

   //Constructor del resolver de ActiveStatusExpirable
  constructor(
    private readonly service: ActiveStatusExpirableQueryService,
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
      .registerClient(ActiveStatusExpirableResolver.name)

      .get(ActiveStatusExpirableResolver.name),
    })
  // Mutaciones
  @Mutation(() => ActiveStatusExpirableResponse<ActiveStatusExpirable>)
  async createActiveStatusExpirable(
    @Args("input", { type: () => CreateActiveStatusExpirableDto }) input: CreateActiveStatusExpirableDto
  ): Promise<ActiveStatusExpirableResponse<ActiveStatusExpirable>> {
    return this.commandBus.execute(new CreateActiveStatusExpirableCommand(input));
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
      .registerClient(ActiveStatusExpirableResolver.name)

      .get(ActiveStatusExpirableResolver.name),
    })
  @Mutation(() => ActiveStatusExpirableResponse<ActiveStatusExpirable>)
  async updateActiveStatusExpirable(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateActiveStatusExpirableDto
  ): Promise<ActiveStatusExpirableResponse<ActiveStatusExpirable>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateActiveStatusExpirableCommand(payLoad, {
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
      .registerClient(ActiveStatusExpirableResolver.name)

      .get(ActiveStatusExpirableResolver.name),
    })
  @Mutation(() => ActiveStatusExpirableResponse<ActiveStatusExpirable>)
  async createOrUpdateActiveStatusExpirable(
    @Args("data", { type: () => CreateOrUpdateActiveStatusExpirableDto })
    data: CreateOrUpdateActiveStatusExpirableDto
  ): Promise<ActiveStatusExpirableResponse<ActiveStatusExpirable>> {
    if (data.id) {
      const existingActiveStatusExpirable = await this.service.findById(data.id);
      if (existingActiveStatusExpirable) {
        return this.commandBus.execute(
          new UpdateActiveStatusExpirableCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateActiveStatusExpirableDto | UpdateActiveStatusExpirableDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateActiveStatusExpirableCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateActiveStatusExpirableDto | UpdateActiveStatusExpirableDto).createdBy ||
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
      .registerClient(ActiveStatusExpirableResolver.name)

      .get(ActiveStatusExpirableResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteActiveStatusExpirable(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteActiveStatusExpirableCommand(id));
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
      .registerClient(ActiveStatusExpirableResolver.name)

      .get(ActiveStatusExpirableResolver.name),
    })
  // Queries
  @Query(() => ActiveStatusExpirablesResponse<ActiveStatusExpirable>)
  async activestatusexpirables(
    options?: FindManyOptions<ActiveStatusExpirable>,
    paginationArgs?: PaginationArgs
  ): Promise<ActiveStatusExpirablesResponse<ActiveStatusExpirable>> {
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
      .registerClient(ActiveStatusExpirableResolver.name)

      .get(ActiveStatusExpirableResolver.name),
    })
  @Query(() => ActiveStatusExpirablesResponse<ActiveStatusExpirable>)
  async activestatusexpirable(
    @Args("id", { type: () => String }) id: string
  ): Promise<ActiveStatusExpirableResponse<ActiveStatusExpirable>> {
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
      .registerClient(ActiveStatusExpirableResolver.name)

      .get(ActiveStatusExpirableResolver.name),
    })
  @Query(() => ActiveStatusExpirablesResponse<ActiveStatusExpirable>)
  async activestatusexpirablesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => ActiveStatusExpirableValueInput }) value: ActiveStatusExpirableValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ActiveStatusExpirablesResponse<ActiveStatusExpirable>> {
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
      .registerClient(ActiveStatusExpirableResolver.name)

      .get(ActiveStatusExpirableResolver.name),
    })
  @Query(() => ActiveStatusExpirablesResponse<ActiveStatusExpirable>)
  async activestatusexpirablesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ActiveStatusExpirablesResponse<ActiveStatusExpirable>> {
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
      .registerClient(ActiveStatusExpirableResolver.name)

      .get(ActiveStatusExpirableResolver.name),
    })
  @Query(() => Number)
  async totalActiveStatusExpirables(): Promise<number> {
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
      .registerClient(ActiveStatusExpirableResolver.name)

      .get(ActiveStatusExpirableResolver.name),
    })
  @Query(() => ActiveStatusExpirablesResponse<ActiveStatusExpirable>)
  async searchActiveStatusExpirables(
    @Args("where", { type: () => ActiveStatusExpirableDto, nullable: false })
    where: Record<string, any>
  ): Promise<ActiveStatusExpirablesResponse<ActiveStatusExpirable>> {
    const activestatusexpirables = await this.service.findAndCount(where);
    return activestatusexpirables;
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
      .registerClient(ActiveStatusExpirableResolver.name)

      .get(ActiveStatusExpirableResolver.name),
    })
  @Query(() => ActiveStatusExpirableResponse<ActiveStatusExpirable>, { nullable: true })
  async findOneActiveStatusExpirable(
    @Args("where", { type: () => ActiveStatusExpirableDto, nullable: false })
    where: Record<string, any>
  ): Promise<ActiveStatusExpirableResponse<ActiveStatusExpirable>> {
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
      .registerClient(ActiveStatusExpirableResolver.name)

      .get(ActiveStatusExpirableResolver.name),
    })
  @Query(() => ActiveStatusExpirableResponse<ActiveStatusExpirable>)
  async findOneActiveStatusExpirableOrFail(
    @Args("where", { type: () => ActiveStatusExpirableDto, nullable: false })
    where: Record<string, any>
  ): Promise<ActiveStatusExpirableResponse<ActiveStatusExpirable> | Error> {
    return this.service.findOneOrFail(where);
  }
}

