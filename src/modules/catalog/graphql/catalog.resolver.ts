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
import { Catalog } from "../entities/catalog.entity";

//Definición de comandos
import {
  CreateCatalogCommand,
  UpdateCatalogCommand,
  DeleteCatalogCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { CatalogQueryService } from "../services/catalogquery.service";


import { CatalogResponse, CatalogsResponse } from "../types/catalog.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateCatalogDto, 
CreateOrUpdateCatalogDto, 
CatalogValueInput, 
CatalogDto, 
CreateCatalogDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => Catalog)
export class CatalogResolver {

   //Constructor del resolver de Catalog
  constructor(
    private readonly service: CatalogQueryService,
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
      .registerClient(CatalogResolver.name)

      .get(CatalogResolver.name),
    })
  // Mutaciones
  @Mutation(() => CatalogResponse<Catalog>)
  async createCatalog(
    @Args("input", { type: () => CreateCatalogDto }) input: CreateCatalogDto
  ): Promise<CatalogResponse<Catalog>> {
    return this.commandBus.execute(new CreateCatalogCommand(input));
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
      .registerClient(CatalogResolver.name)

      .get(CatalogResolver.name),
    })
  @Mutation(() => CatalogResponse<Catalog>)
  async updateCatalog(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateCatalogDto
  ): Promise<CatalogResponse<Catalog>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateCatalogCommand(payLoad, {
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
      .registerClient(CatalogResolver.name)

      .get(CatalogResolver.name),
    })
  @Mutation(() => CatalogResponse<Catalog>)
  async createOrUpdateCatalog(
    @Args("data", { type: () => CreateOrUpdateCatalogDto })
    data: CreateOrUpdateCatalogDto
  ): Promise<CatalogResponse<Catalog>> {
    if (data.id) {
      const existingCatalog = await this.service.findById(data.id);
      if (existingCatalog) {
        return this.commandBus.execute(
          new UpdateCatalogCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateCatalogDto | UpdateCatalogDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateCatalogCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateCatalogDto | UpdateCatalogDto).createdBy ||
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
      .registerClient(CatalogResolver.name)

      .get(CatalogResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteCatalog(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteCatalogCommand(id));
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
      .registerClient(CatalogResolver.name)

      .get(CatalogResolver.name),
    })
  // Queries
  @Query(() => CatalogsResponse<Catalog>)
  async catalogs(
    options?: FindManyOptions<Catalog>,
    paginationArgs?: PaginationArgs
  ): Promise<CatalogsResponse<Catalog>> {
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
      .registerClient(CatalogResolver.name)

      .get(CatalogResolver.name),
    })
  @Query(() => CatalogsResponse<Catalog>)
  async catalog(
    @Args("id", { type: () => String }) id: string
  ): Promise<CatalogResponse<Catalog>> {
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
      .registerClient(CatalogResolver.name)

      .get(CatalogResolver.name),
    })
  @Query(() => CatalogsResponse<Catalog>)
  async catalogsByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => CatalogValueInput }) value: CatalogValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<CatalogsResponse<Catalog>> {
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
      .registerClient(CatalogResolver.name)

      .get(CatalogResolver.name),
    })
  @Query(() => CatalogsResponse<Catalog>)
  async catalogsWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<CatalogsResponse<Catalog>> {
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
      .registerClient(CatalogResolver.name)

      .get(CatalogResolver.name),
    })
  @Query(() => Number)
  async totalCatalogs(): Promise<number> {
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
      .registerClient(CatalogResolver.name)

      .get(CatalogResolver.name),
    })
  @Query(() => CatalogsResponse<Catalog>)
  async searchCatalogs(
    @Args("where", { type: () => CatalogDto, nullable: false })
    where: Record<string, any>
  ): Promise<CatalogsResponse<Catalog>> {
    const catalogs = await this.service.findAndCount(where);
    return catalogs;
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
      .registerClient(CatalogResolver.name)

      .get(CatalogResolver.name),
    })
  @Query(() => CatalogResponse<Catalog>, { nullable: true })
  async findOneCatalog(
    @Args("where", { type: () => CatalogDto, nullable: false })
    where: Record<string, any>
  ): Promise<CatalogResponse<Catalog>> {
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
      .registerClient(CatalogResolver.name)

      .get(CatalogResolver.name),
    })
  @Query(() => CatalogResponse<Catalog>)
  async findOneCatalogOrFail(
    @Args("where", { type: () => CatalogDto, nullable: false })
    where: Record<string, any>
  ): Promise<CatalogResponse<Catalog> | Error> {
    return this.service.findOneOrFail(where);
  }
}

