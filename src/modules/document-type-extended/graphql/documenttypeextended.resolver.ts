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
import { DocumentTypeExtended } from "../entities/document-type-extended.entity";

//Definición de comandos
import {
  CreateDocumentTypeExtendedCommand,
  UpdateDocumentTypeExtendedCommand,
  DeleteDocumentTypeExtendedCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { DocumentTypeExtendedQueryService } from "../services/documenttypeextendedquery.service";


import { DocumentTypeExtendedResponse, DocumentTypeExtendedsResponse } from "../types/documenttypeextended.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateDocumentTypeExtendedDto, 
CreateOrUpdateDocumentTypeExtendedDto, 
DocumentTypeExtendedValueInput, 
DocumentTypeExtendedDto, 
CreateDocumentTypeExtendedDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => DocumentTypeExtended)
export class DocumentTypeExtendedResolver {

   //Constructor del resolver de DocumentTypeExtended
  constructor(
    private readonly service: DocumentTypeExtendedQueryService,
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
      .registerClient(DocumentTypeExtendedResolver.name)

      .get(DocumentTypeExtendedResolver.name),
    })
  // Mutaciones
  @Mutation(() => DocumentTypeExtendedResponse<DocumentTypeExtended>)
  async createDocumentTypeExtended(
    @Args("input", { type: () => CreateDocumentTypeExtendedDto }) input: CreateDocumentTypeExtendedDto
  ): Promise<DocumentTypeExtendedResponse<DocumentTypeExtended>> {
    return this.commandBus.execute(new CreateDocumentTypeExtendedCommand(input));
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
      .registerClient(DocumentTypeExtendedResolver.name)

      .get(DocumentTypeExtendedResolver.name),
    })
  @Mutation(() => DocumentTypeExtendedResponse<DocumentTypeExtended>)
  async updateDocumentTypeExtended(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateDocumentTypeExtendedDto
  ): Promise<DocumentTypeExtendedResponse<DocumentTypeExtended>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateDocumentTypeExtendedCommand(payLoad, {
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
      .registerClient(DocumentTypeExtendedResolver.name)

      .get(DocumentTypeExtendedResolver.name),
    })
  @Mutation(() => DocumentTypeExtendedResponse<DocumentTypeExtended>)
  async createOrUpdateDocumentTypeExtended(
    @Args("data", { type: () => CreateOrUpdateDocumentTypeExtendedDto })
    data: CreateOrUpdateDocumentTypeExtendedDto
  ): Promise<DocumentTypeExtendedResponse<DocumentTypeExtended>> {
    if (data.id) {
      const existingDocumentTypeExtended = await this.service.findById(data.id);
      if (existingDocumentTypeExtended) {
        return this.commandBus.execute(
          new UpdateDocumentTypeExtendedCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateDocumentTypeExtendedDto | UpdateDocumentTypeExtendedDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateDocumentTypeExtendedCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateDocumentTypeExtendedDto | UpdateDocumentTypeExtendedDto).createdBy ||
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
      .registerClient(DocumentTypeExtendedResolver.name)

      .get(DocumentTypeExtendedResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteDocumentTypeExtended(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteDocumentTypeExtendedCommand(id));
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
      .registerClient(DocumentTypeExtendedResolver.name)

      .get(DocumentTypeExtendedResolver.name),
    })
  // Queries
  @Query(() => DocumentTypeExtendedsResponse<DocumentTypeExtended>)
  async documenttypeextendeds(
    options?: FindManyOptions<DocumentTypeExtended>,
    paginationArgs?: PaginationArgs
  ): Promise<DocumentTypeExtendedsResponse<DocumentTypeExtended>> {
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
      .registerClient(DocumentTypeExtendedResolver.name)

      .get(DocumentTypeExtendedResolver.name),
    })
  @Query(() => DocumentTypeExtendedsResponse<DocumentTypeExtended>)
  async documenttypeextended(
    @Args("id", { type: () => String }) id: string
  ): Promise<DocumentTypeExtendedResponse<DocumentTypeExtended>> {
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
      .registerClient(DocumentTypeExtendedResolver.name)

      .get(DocumentTypeExtendedResolver.name),
    })
  @Query(() => DocumentTypeExtendedsResponse<DocumentTypeExtended>)
  async documenttypeextendedsByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => DocumentTypeExtendedValueInput }) value: DocumentTypeExtendedValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<DocumentTypeExtendedsResponse<DocumentTypeExtended>> {
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
      .registerClient(DocumentTypeExtendedResolver.name)

      .get(DocumentTypeExtendedResolver.name),
    })
  @Query(() => DocumentTypeExtendedsResponse<DocumentTypeExtended>)
  async documenttypeextendedsWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<DocumentTypeExtendedsResponse<DocumentTypeExtended>> {
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
      .registerClient(DocumentTypeExtendedResolver.name)

      .get(DocumentTypeExtendedResolver.name),
    })
  @Query(() => Number)
  async totalDocumentTypeExtendeds(): Promise<number> {
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
      .registerClient(DocumentTypeExtendedResolver.name)

      .get(DocumentTypeExtendedResolver.name),
    })
  @Query(() => DocumentTypeExtendedsResponse<DocumentTypeExtended>)
  async searchDocumentTypeExtendeds(
    @Args("where", { type: () => DocumentTypeExtendedDto, nullable: false })
    where: Record<string, any>
  ): Promise<DocumentTypeExtendedsResponse<DocumentTypeExtended>> {
    const documenttypeextendeds = await this.service.findAndCount(where);
    return documenttypeextendeds;
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
      .registerClient(DocumentTypeExtendedResolver.name)

      .get(DocumentTypeExtendedResolver.name),
    })
  @Query(() => DocumentTypeExtendedResponse<DocumentTypeExtended>, { nullable: true })
  async findOneDocumentTypeExtended(
    @Args("where", { type: () => DocumentTypeExtendedDto, nullable: false })
    where: Record<string, any>
  ): Promise<DocumentTypeExtendedResponse<DocumentTypeExtended>> {
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
      .registerClient(DocumentTypeExtendedResolver.name)

      .get(DocumentTypeExtendedResolver.name),
    })
  @Query(() => DocumentTypeExtendedResponse<DocumentTypeExtended>)
  async findOneDocumentTypeExtendedOrFail(
    @Args("where", { type: () => DocumentTypeExtendedDto, nullable: false })
    where: Record<string, any>
  ): Promise<DocumentTypeExtendedResponse<DocumentTypeExtended> | Error> {
    return this.service.findOneOrFail(where);
  }
}

