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
import { CatalogCategory } from "../entities/catalog-category.entity";

//Definición de comandos
import {
  CreateCatalogCategoryCommand,
  UpdateCatalogCategoryCommand,
  DeleteCatalogCategoryCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { CatalogCategoryQueryService } from "../services/catalogcategoryquery.service";


import { CatalogCategoryResponse, CatalogCategorysResponse } from "../types/catalogcategory.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateCatalogCategoryDto, 
CreateOrUpdateCatalogCategoryDto, 
CatalogCategoryValueInput, 
CatalogCategoryDto, 
CreateCatalogCategoryDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => CatalogCategory)
export class CatalogCategoryResolver {

   //Constructor del resolver de CatalogCategory
  constructor(
    private readonly service: CatalogCategoryQueryService,
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
      .registerClient(CatalogCategoryResolver.name)

      .get(CatalogCategoryResolver.name),
    })
  // Mutaciones
  @Mutation(() => CatalogCategoryResponse<CatalogCategory>)
  async createCatalogCategory(
    @Args("input", { type: () => CreateCatalogCategoryDto }) input: CreateCatalogCategoryDto
  ): Promise<CatalogCategoryResponse<CatalogCategory>> {
    return this.commandBus.execute(new CreateCatalogCategoryCommand(input));
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
      .registerClient(CatalogCategoryResolver.name)

      .get(CatalogCategoryResolver.name),
    })
  @Mutation(() => CatalogCategoryResponse<CatalogCategory>)
  async updateCatalogCategory(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateCatalogCategoryDto
  ): Promise<CatalogCategoryResponse<CatalogCategory>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateCatalogCategoryCommand(payLoad, {
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
      .registerClient(CatalogCategoryResolver.name)

      .get(CatalogCategoryResolver.name),
    })
  @Mutation(() => CatalogCategoryResponse<CatalogCategory>)
  async createOrUpdateCatalogCategory(
    @Args("data", { type: () => CreateOrUpdateCatalogCategoryDto })
    data: CreateOrUpdateCatalogCategoryDto
  ): Promise<CatalogCategoryResponse<CatalogCategory>> {
    if (data.id) {
      const existingCatalogCategory = await this.service.findById(data.id);
      if (existingCatalogCategory) {
        return this.commandBus.execute(
          new UpdateCatalogCategoryCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateCatalogCategoryDto | UpdateCatalogCategoryDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateCatalogCategoryCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateCatalogCategoryDto | UpdateCatalogCategoryDto).createdBy ||
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
      .registerClient(CatalogCategoryResolver.name)

      .get(CatalogCategoryResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteCatalogCategory(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteCatalogCategoryCommand(id));
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
      .registerClient(CatalogCategoryResolver.name)

      .get(CatalogCategoryResolver.name),
    })
  // Queries
  @Query(() => CatalogCategorysResponse<CatalogCategory>)
  async catalogcategorys(
    options?: FindManyOptions<CatalogCategory>,
    paginationArgs?: PaginationArgs
  ): Promise<CatalogCategorysResponse<CatalogCategory>> {
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
      .registerClient(CatalogCategoryResolver.name)

      .get(CatalogCategoryResolver.name),
    })
  @Query(() => CatalogCategorysResponse<CatalogCategory>)
  async catalogcategory(
    @Args("id", { type: () => String }) id: string
  ): Promise<CatalogCategoryResponse<CatalogCategory>> {
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
      .registerClient(CatalogCategoryResolver.name)

      .get(CatalogCategoryResolver.name),
    })
  @Query(() => CatalogCategorysResponse<CatalogCategory>)
  async catalogcategorysByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => CatalogCategoryValueInput }) value: CatalogCategoryValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<CatalogCategorysResponse<CatalogCategory>> {
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
      .registerClient(CatalogCategoryResolver.name)

      .get(CatalogCategoryResolver.name),
    })
  @Query(() => CatalogCategorysResponse<CatalogCategory>)
  async catalogcategorysWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<CatalogCategorysResponse<CatalogCategory>> {
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
      .registerClient(CatalogCategoryResolver.name)

      .get(CatalogCategoryResolver.name),
    })
  @Query(() => Number)
  async totalCatalogCategorys(): Promise<number> {
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
      .registerClient(CatalogCategoryResolver.name)

      .get(CatalogCategoryResolver.name),
    })
  @Query(() => CatalogCategorysResponse<CatalogCategory>)
  async searchCatalogCategorys(
    @Args("where", { type: () => CatalogCategoryDto, nullable: false })
    where: Record<string, any>
  ): Promise<CatalogCategorysResponse<CatalogCategory>> {
    const catalogcategorys = await this.service.findAndCount(where);
    return catalogcategorys;
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
      .registerClient(CatalogCategoryResolver.name)

      .get(CatalogCategoryResolver.name),
    })
  @Query(() => CatalogCategoryResponse<CatalogCategory>, { nullable: true })
  async findOneCatalogCategory(
    @Args("where", { type: () => CatalogCategoryDto, nullable: false })
    where: Record<string, any>
  ): Promise<CatalogCategoryResponse<CatalogCategory>> {
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
      .registerClient(CatalogCategoryResolver.name)

      .get(CatalogCategoryResolver.name),
    })
  @Query(() => CatalogCategoryResponse<CatalogCategory>)
  async findOneCatalogCategoryOrFail(
    @Args("where", { type: () => CatalogCategoryDto, nullable: false })
    where: Record<string, any>
  ): Promise<CatalogCategoryResponse<CatalogCategory> | Error> {
    return this.service.findOneOrFail(where);
  }
}

