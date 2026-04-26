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
import { CurrencyCode } from "../entities/currency-code.entity";

//Definición de comandos
import {
  CreateCurrencyCodeCommand,
  UpdateCurrencyCodeCommand,
  DeleteCurrencyCodeCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { CurrencyCodeQueryService } from "../services/currencycodequery.service";


import { CurrencyCodeResponse, CurrencyCodesResponse } from "../types/currencycode.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateCurrencyCodeDto, 
CreateOrUpdateCurrencyCodeDto, 
CurrencyCodeValueInput, 
CurrencyCodeDto, 
CreateCurrencyCodeDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => CurrencyCode)
export class CurrencyCodeResolver {

   //Constructor del resolver de CurrencyCode
  constructor(
    private readonly service: CurrencyCodeQueryService,
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
      .registerClient(CurrencyCodeResolver.name)

      .get(CurrencyCodeResolver.name),
    })
  // Mutaciones
  @Mutation(() => CurrencyCodeResponse<CurrencyCode>)
  async createCurrencyCode(
    @Args("input", { type: () => CreateCurrencyCodeDto }) input: CreateCurrencyCodeDto
  ): Promise<CurrencyCodeResponse<CurrencyCode>> {
    return this.commandBus.execute(new CreateCurrencyCodeCommand(input));
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
      .registerClient(CurrencyCodeResolver.name)

      .get(CurrencyCodeResolver.name),
    })
  @Mutation(() => CurrencyCodeResponse<CurrencyCode>)
  async updateCurrencyCode(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateCurrencyCodeDto
  ): Promise<CurrencyCodeResponse<CurrencyCode>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateCurrencyCodeCommand(payLoad, {
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
      .registerClient(CurrencyCodeResolver.name)

      .get(CurrencyCodeResolver.name),
    })
  @Mutation(() => CurrencyCodeResponse<CurrencyCode>)
  async createOrUpdateCurrencyCode(
    @Args("data", { type: () => CreateOrUpdateCurrencyCodeDto })
    data: CreateOrUpdateCurrencyCodeDto
  ): Promise<CurrencyCodeResponse<CurrencyCode>> {
    if (data.id) {
      const existingCurrencyCode = await this.service.findById(data.id);
      if (existingCurrencyCode) {
        return this.commandBus.execute(
          new UpdateCurrencyCodeCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateCurrencyCodeDto | UpdateCurrencyCodeDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateCurrencyCodeCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateCurrencyCodeDto | UpdateCurrencyCodeDto).createdBy ||
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
      .registerClient(CurrencyCodeResolver.name)

      .get(CurrencyCodeResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteCurrencyCode(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteCurrencyCodeCommand(id));
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
      .registerClient(CurrencyCodeResolver.name)

      .get(CurrencyCodeResolver.name),
    })
  // Queries
  @Query(() => CurrencyCodesResponse<CurrencyCode>)
  async currencycodes(
    options?: FindManyOptions<CurrencyCode>,
    paginationArgs?: PaginationArgs
  ): Promise<CurrencyCodesResponse<CurrencyCode>> {
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
      .registerClient(CurrencyCodeResolver.name)

      .get(CurrencyCodeResolver.name),
    })
  @Query(() => CurrencyCodesResponse<CurrencyCode>)
  async currencycode(
    @Args("id", { type: () => String }) id: string
  ): Promise<CurrencyCodeResponse<CurrencyCode>> {
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
      .registerClient(CurrencyCodeResolver.name)

      .get(CurrencyCodeResolver.name),
    })
  @Query(() => CurrencyCodesResponse<CurrencyCode>)
  async currencycodesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => CurrencyCodeValueInput }) value: CurrencyCodeValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<CurrencyCodesResponse<CurrencyCode>> {
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
      .registerClient(CurrencyCodeResolver.name)

      .get(CurrencyCodeResolver.name),
    })
  @Query(() => CurrencyCodesResponse<CurrencyCode>)
  async currencycodesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<CurrencyCodesResponse<CurrencyCode>> {
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
      .registerClient(CurrencyCodeResolver.name)

      .get(CurrencyCodeResolver.name),
    })
  @Query(() => Number)
  async totalCurrencyCodes(): Promise<number> {
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
      .registerClient(CurrencyCodeResolver.name)

      .get(CurrencyCodeResolver.name),
    })
  @Query(() => CurrencyCodesResponse<CurrencyCode>)
  async searchCurrencyCodes(
    @Args("where", { type: () => CurrencyCodeDto, nullable: false })
    where: Record<string, any>
  ): Promise<CurrencyCodesResponse<CurrencyCode>> {
    const currencycodes = await this.service.findAndCount(where);
    return currencycodes;
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
      .registerClient(CurrencyCodeResolver.name)

      .get(CurrencyCodeResolver.name),
    })
  @Query(() => CurrencyCodeResponse<CurrencyCode>, { nullable: true })
  async findOneCurrencyCode(
    @Args("where", { type: () => CurrencyCodeDto, nullable: false })
    where: Record<string, any>
  ): Promise<CurrencyCodeResponse<CurrencyCode>> {
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
      .registerClient(CurrencyCodeResolver.name)

      .get(CurrencyCodeResolver.name),
    })
  @Query(() => CurrencyCodeResponse<CurrencyCode>)
  async findOneCurrencyCodeOrFail(
    @Args("where", { type: () => CurrencyCodeDto, nullable: false })
    where: Record<string, any>
  ): Promise<CurrencyCodeResponse<CurrencyCode> | Error> {
    return this.service.findOneOrFail(where);
  }
}

