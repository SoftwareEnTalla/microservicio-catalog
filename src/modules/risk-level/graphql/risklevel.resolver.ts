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
import { RiskLevel } from "../entities/risk-level.entity";

//Definición de comandos
import {
  CreateRiskLevelCommand,
  UpdateRiskLevelCommand,
  DeleteRiskLevelCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { RiskLevelQueryService } from "../services/risklevelquery.service";


import { RiskLevelResponse, RiskLevelsResponse } from "../types/risklevel.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateRiskLevelDto, 
CreateOrUpdateRiskLevelDto, 
RiskLevelValueInput, 
RiskLevelDto, 
CreateRiskLevelDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => RiskLevel)
export class RiskLevelResolver {

   //Constructor del resolver de RiskLevel
  constructor(
    private readonly service: RiskLevelQueryService,
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
      .registerClient(RiskLevelResolver.name)

      .get(RiskLevelResolver.name),
    })
  // Mutaciones
  @Mutation(() => RiskLevelResponse<RiskLevel>)
  async createRiskLevel(
    @Args("input", { type: () => CreateRiskLevelDto }) input: CreateRiskLevelDto
  ): Promise<RiskLevelResponse<RiskLevel>> {
    return this.commandBus.execute(new CreateRiskLevelCommand(input));
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
      .registerClient(RiskLevelResolver.name)

      .get(RiskLevelResolver.name),
    })
  @Mutation(() => RiskLevelResponse<RiskLevel>)
  async updateRiskLevel(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateRiskLevelDto
  ): Promise<RiskLevelResponse<RiskLevel>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateRiskLevelCommand(payLoad, {
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
      .registerClient(RiskLevelResolver.name)

      .get(RiskLevelResolver.name),
    })
  @Mutation(() => RiskLevelResponse<RiskLevel>)
  async createOrUpdateRiskLevel(
    @Args("data", { type: () => CreateOrUpdateRiskLevelDto })
    data: CreateOrUpdateRiskLevelDto
  ): Promise<RiskLevelResponse<RiskLevel>> {
    if (data.id) {
      const existingRiskLevel = await this.service.findById(data.id);
      if (existingRiskLevel) {
        return this.commandBus.execute(
          new UpdateRiskLevelCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateRiskLevelDto | UpdateRiskLevelDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateRiskLevelCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateRiskLevelDto | UpdateRiskLevelDto).createdBy ||
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
      .registerClient(RiskLevelResolver.name)

      .get(RiskLevelResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteRiskLevel(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteRiskLevelCommand(id));
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
      .registerClient(RiskLevelResolver.name)

      .get(RiskLevelResolver.name),
    })
  // Queries
  @Query(() => RiskLevelsResponse<RiskLevel>)
  async risklevels(
    options?: FindManyOptions<RiskLevel>,
    paginationArgs?: PaginationArgs
  ): Promise<RiskLevelsResponse<RiskLevel>> {
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
      .registerClient(RiskLevelResolver.name)

      .get(RiskLevelResolver.name),
    })
  @Query(() => RiskLevelsResponse<RiskLevel>)
  async risklevel(
    @Args("id", { type: () => String }) id: string
  ): Promise<RiskLevelResponse<RiskLevel>> {
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
      .registerClient(RiskLevelResolver.name)

      .get(RiskLevelResolver.name),
    })
  @Query(() => RiskLevelsResponse<RiskLevel>)
  async risklevelsByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => RiskLevelValueInput }) value: RiskLevelValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<RiskLevelsResponse<RiskLevel>> {
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
      .registerClient(RiskLevelResolver.name)

      .get(RiskLevelResolver.name),
    })
  @Query(() => RiskLevelsResponse<RiskLevel>)
  async risklevelsWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<RiskLevelsResponse<RiskLevel>> {
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
      .registerClient(RiskLevelResolver.name)

      .get(RiskLevelResolver.name),
    })
  @Query(() => Number)
  async totalRiskLevels(): Promise<number> {
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
      .registerClient(RiskLevelResolver.name)

      .get(RiskLevelResolver.name),
    })
  @Query(() => RiskLevelsResponse<RiskLevel>)
  async searchRiskLevels(
    @Args("where", { type: () => RiskLevelDto, nullable: false })
    where: Record<string, any>
  ): Promise<RiskLevelsResponse<RiskLevel>> {
    const risklevels = await this.service.findAndCount(where);
    return risklevels;
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
      .registerClient(RiskLevelResolver.name)

      .get(RiskLevelResolver.name),
    })
  @Query(() => RiskLevelResponse<RiskLevel>, { nullable: true })
  async findOneRiskLevel(
    @Args("where", { type: () => RiskLevelDto, nullable: false })
    where: Record<string, any>
  ): Promise<RiskLevelResponse<RiskLevel>> {
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
      .registerClient(RiskLevelResolver.name)

      .get(RiskLevelResolver.name),
    })
  @Query(() => RiskLevelResponse<RiskLevel>)
  async findOneRiskLevelOrFail(
    @Args("where", { type: () => RiskLevelDto, nullable: false })
    where: Record<string, any>
  ): Promise<RiskLevelResponse<RiskLevel> | Error> {
    return this.service.findOneOrFail(where);
  }
}

