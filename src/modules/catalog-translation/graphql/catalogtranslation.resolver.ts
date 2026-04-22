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
import { CatalogTranslation } from "../entities/catalog-translation.entity";

//Definición de comandos
import {
  CreateCatalogTranslationCommand,
  UpdateCatalogTranslationCommand,
  DeleteCatalogTranslationCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { CatalogTranslationQueryService } from "../services/catalogtranslationquery.service";


import { CatalogTranslationResponse, CatalogTranslationsResponse } from "../types/catalogtranslation.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateCatalogTranslationDto, 
CreateOrUpdateCatalogTranslationDto, 
CatalogTranslationValueInput, 
CatalogTranslationDto, 
CreateCatalogTranslationDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => CatalogTranslation)
export class CatalogTranslationResolver {

   //Constructor del resolver de CatalogTranslation
  constructor(
    private readonly service: CatalogTranslationQueryService,
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
      .registerClient(CatalogTranslationResolver.name)

      .get(CatalogTranslationResolver.name),
    })
  // Mutaciones
  @Mutation(() => CatalogTranslationResponse<CatalogTranslation>)
  async createCatalogTranslation(
    @Args("input", { type: () => CreateCatalogTranslationDto }) input: CreateCatalogTranslationDto
  ): Promise<CatalogTranslationResponse<CatalogTranslation>> {
    return this.commandBus.execute(new CreateCatalogTranslationCommand(input));
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
      .registerClient(CatalogTranslationResolver.name)

      .get(CatalogTranslationResolver.name),
    })
  @Mutation(() => CatalogTranslationResponse<CatalogTranslation>)
  async updateCatalogTranslation(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateCatalogTranslationDto
  ): Promise<CatalogTranslationResponse<CatalogTranslation>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateCatalogTranslationCommand(payLoad, {
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
      .registerClient(CatalogTranslationResolver.name)

      .get(CatalogTranslationResolver.name),
    })
  @Mutation(() => CatalogTranslationResponse<CatalogTranslation>)
  async createOrUpdateCatalogTranslation(
    @Args("data", { type: () => CreateOrUpdateCatalogTranslationDto })
    data: CreateOrUpdateCatalogTranslationDto
  ): Promise<CatalogTranslationResponse<CatalogTranslation>> {
    if (data.id) {
      const existingCatalogTranslation = await this.service.findById(data.id);
      if (existingCatalogTranslation) {
        return this.commandBus.execute(
          new UpdateCatalogTranslationCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateCatalogTranslationDto | UpdateCatalogTranslationDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateCatalogTranslationCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateCatalogTranslationDto | UpdateCatalogTranslationDto).createdBy ||
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
      .registerClient(CatalogTranslationResolver.name)

      .get(CatalogTranslationResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteCatalogTranslation(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteCatalogTranslationCommand(id));
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
      .registerClient(CatalogTranslationResolver.name)

      .get(CatalogTranslationResolver.name),
    })
  // Queries
  @Query(() => CatalogTranslationsResponse<CatalogTranslation>)
  async catalogtranslations(
    options?: FindManyOptions<CatalogTranslation>,
    paginationArgs?: PaginationArgs
  ): Promise<CatalogTranslationsResponse<CatalogTranslation>> {
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
      .registerClient(CatalogTranslationResolver.name)

      .get(CatalogTranslationResolver.name),
    })
  @Query(() => CatalogTranslationsResponse<CatalogTranslation>)
  async catalogtranslation(
    @Args("id", { type: () => String }) id: string
  ): Promise<CatalogTranslationResponse<CatalogTranslation>> {
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
      .registerClient(CatalogTranslationResolver.name)

      .get(CatalogTranslationResolver.name),
    })
  @Query(() => CatalogTranslationsResponse<CatalogTranslation>)
  async catalogtranslationsByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => CatalogTranslationValueInput }) value: CatalogTranslationValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<CatalogTranslationsResponse<CatalogTranslation>> {
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
      .registerClient(CatalogTranslationResolver.name)

      .get(CatalogTranslationResolver.name),
    })
  @Query(() => CatalogTranslationsResponse<CatalogTranslation>)
  async catalogtranslationsWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<CatalogTranslationsResponse<CatalogTranslation>> {
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
      .registerClient(CatalogTranslationResolver.name)

      .get(CatalogTranslationResolver.name),
    })
  @Query(() => Number)
  async totalCatalogTranslations(): Promise<number> {
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
      .registerClient(CatalogTranslationResolver.name)

      .get(CatalogTranslationResolver.name),
    })
  @Query(() => CatalogTranslationsResponse<CatalogTranslation>)
  async searchCatalogTranslations(
    @Args("where", { type: () => CatalogTranslationDto, nullable: false })
    where: Record<string, any>
  ): Promise<CatalogTranslationsResponse<CatalogTranslation>> {
    const catalogtranslations = await this.service.findAndCount(where);
    return catalogtranslations;
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
      .registerClient(CatalogTranslationResolver.name)

      .get(CatalogTranslationResolver.name),
    })
  @Query(() => CatalogTranslationResponse<CatalogTranslation>, { nullable: true })
  async findOneCatalogTranslation(
    @Args("where", { type: () => CatalogTranslationDto, nullable: false })
    where: Record<string, any>
  ): Promise<CatalogTranslationResponse<CatalogTranslation>> {
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
      .registerClient(CatalogTranslationResolver.name)

      .get(CatalogTranslationResolver.name),
    })
  @Query(() => CatalogTranslationResponse<CatalogTranslation>)
  async findOneCatalogTranslationOrFail(
    @Args("where", { type: () => CatalogTranslationDto, nullable: false })
    where: Record<string, any>
  ): Promise<CatalogTranslationResponse<CatalogTranslation> | Error> {
    return this.service.findOneOrFail(where);
  }
}

