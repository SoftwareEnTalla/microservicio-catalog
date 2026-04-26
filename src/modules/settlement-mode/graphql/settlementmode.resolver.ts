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
import { SettlementMode } from "../entities/settlement-mode.entity";

//Definición de comandos
import {
  CreateSettlementModeCommand,
  UpdateSettlementModeCommand,
  DeleteSettlementModeCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { SettlementModeQueryService } from "../services/settlementmodequery.service";


import { SettlementModeResponse, SettlementModesResponse } from "../types/settlementmode.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateSettlementModeDto, 
CreateOrUpdateSettlementModeDto, 
SettlementModeValueInput, 
SettlementModeDto, 
CreateSettlementModeDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => SettlementMode)
export class SettlementModeResolver {

   //Constructor del resolver de SettlementMode
  constructor(
    private readonly service: SettlementModeQueryService,
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
      .registerClient(SettlementModeResolver.name)

      .get(SettlementModeResolver.name),
    })
  // Mutaciones
  @Mutation(() => SettlementModeResponse<SettlementMode>)
  async createSettlementMode(
    @Args("input", { type: () => CreateSettlementModeDto }) input: CreateSettlementModeDto
  ): Promise<SettlementModeResponse<SettlementMode>> {
    return this.commandBus.execute(new CreateSettlementModeCommand(input));
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
      .registerClient(SettlementModeResolver.name)

      .get(SettlementModeResolver.name),
    })
  @Mutation(() => SettlementModeResponse<SettlementMode>)
  async updateSettlementMode(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateSettlementModeDto
  ): Promise<SettlementModeResponse<SettlementMode>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateSettlementModeCommand(payLoad, {
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
      .registerClient(SettlementModeResolver.name)

      .get(SettlementModeResolver.name),
    })
  @Mutation(() => SettlementModeResponse<SettlementMode>)
  async createOrUpdateSettlementMode(
    @Args("data", { type: () => CreateOrUpdateSettlementModeDto })
    data: CreateOrUpdateSettlementModeDto
  ): Promise<SettlementModeResponse<SettlementMode>> {
    if (data.id) {
      const existingSettlementMode = await this.service.findById(data.id);
      if (existingSettlementMode) {
        return this.commandBus.execute(
          new UpdateSettlementModeCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateSettlementModeDto | UpdateSettlementModeDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateSettlementModeCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateSettlementModeDto | UpdateSettlementModeDto).createdBy ||
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
      .registerClient(SettlementModeResolver.name)

      .get(SettlementModeResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteSettlementMode(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteSettlementModeCommand(id));
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
      .registerClient(SettlementModeResolver.name)

      .get(SettlementModeResolver.name),
    })
  // Queries
  @Query(() => SettlementModesResponse<SettlementMode>)
  async settlementmodes(
    options?: FindManyOptions<SettlementMode>,
    paginationArgs?: PaginationArgs
  ): Promise<SettlementModesResponse<SettlementMode>> {
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
      .registerClient(SettlementModeResolver.name)

      .get(SettlementModeResolver.name),
    })
  @Query(() => SettlementModesResponse<SettlementMode>)
  async settlementmode(
    @Args("id", { type: () => String }) id: string
  ): Promise<SettlementModeResponse<SettlementMode>> {
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
      .registerClient(SettlementModeResolver.name)

      .get(SettlementModeResolver.name),
    })
  @Query(() => SettlementModesResponse<SettlementMode>)
  async settlementmodesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => SettlementModeValueInput }) value: SettlementModeValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<SettlementModesResponse<SettlementMode>> {
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
      .registerClient(SettlementModeResolver.name)

      .get(SettlementModeResolver.name),
    })
  @Query(() => SettlementModesResponse<SettlementMode>)
  async settlementmodesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<SettlementModesResponse<SettlementMode>> {
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
      .registerClient(SettlementModeResolver.name)

      .get(SettlementModeResolver.name),
    })
  @Query(() => Number)
  async totalSettlementModes(): Promise<number> {
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
      .registerClient(SettlementModeResolver.name)

      .get(SettlementModeResolver.name),
    })
  @Query(() => SettlementModesResponse<SettlementMode>)
  async searchSettlementModes(
    @Args("where", { type: () => SettlementModeDto, nullable: false })
    where: Record<string, any>
  ): Promise<SettlementModesResponse<SettlementMode>> {
    const settlementmodes = await this.service.findAndCount(where);
    return settlementmodes;
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
      .registerClient(SettlementModeResolver.name)

      .get(SettlementModeResolver.name),
    })
  @Query(() => SettlementModeResponse<SettlementMode>, { nullable: true })
  async findOneSettlementMode(
    @Args("where", { type: () => SettlementModeDto, nullable: false })
    where: Record<string, any>
  ): Promise<SettlementModeResponse<SettlementMode>> {
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
      .registerClient(SettlementModeResolver.name)

      .get(SettlementModeResolver.name),
    })
  @Query(() => SettlementModeResponse<SettlementMode>)
  async findOneSettlementModeOrFail(
    @Args("where", { type: () => SettlementModeDto, nullable: false })
    where: Record<string, any>
  ): Promise<SettlementModeResponse<SettlementMode> | Error> {
    return this.service.findOneOrFail(where);
  }
}

