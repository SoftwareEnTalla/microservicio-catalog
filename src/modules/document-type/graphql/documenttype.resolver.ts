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
import { DocumentType } from "../entities/document-type.entity";

//Definición de comandos
import {
  CreateDocumentTypeCommand,
  UpdateDocumentTypeCommand,
  DeleteDocumentTypeCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { DocumentTypeQueryService } from "../services/documenttypequery.service";


import { DocumentTypeResponse, DocumentTypesResponse } from "../types/documenttype.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateDocumentTypeDto, 
CreateOrUpdateDocumentTypeDto, 
DocumentTypeValueInput, 
DocumentTypeDto, 
CreateDocumentTypeDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => DocumentType)
export class DocumentTypeResolver {

   //Constructor del resolver de DocumentType
  constructor(
    private readonly service: DocumentTypeQueryService,
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
      .registerClient(DocumentTypeResolver.name)

      .get(DocumentTypeResolver.name),
    })
  // Mutaciones
  @Mutation(() => DocumentTypeResponse<DocumentType>)
  async createDocumentType(
    @Args("input", { type: () => CreateDocumentTypeDto }) input: CreateDocumentTypeDto
  ): Promise<DocumentTypeResponse<DocumentType>> {
    return this.commandBus.execute(new CreateDocumentTypeCommand(input));
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
      .registerClient(DocumentTypeResolver.name)

      .get(DocumentTypeResolver.name),
    })
  @Mutation(() => DocumentTypeResponse<DocumentType>)
  async updateDocumentType(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateDocumentTypeDto
  ): Promise<DocumentTypeResponse<DocumentType>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateDocumentTypeCommand(payLoad, {
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
      .registerClient(DocumentTypeResolver.name)

      .get(DocumentTypeResolver.name),
    })
  @Mutation(() => DocumentTypeResponse<DocumentType>)
  async createOrUpdateDocumentType(
    @Args("data", { type: () => CreateOrUpdateDocumentTypeDto })
    data: CreateOrUpdateDocumentTypeDto
  ): Promise<DocumentTypeResponse<DocumentType>> {
    if (data.id) {
      const existingDocumentType = await this.service.findById(data.id);
      if (existingDocumentType) {
        return this.commandBus.execute(
          new UpdateDocumentTypeCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateDocumentTypeDto | UpdateDocumentTypeDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateDocumentTypeCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateDocumentTypeDto | UpdateDocumentTypeDto).createdBy ||
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
      .registerClient(DocumentTypeResolver.name)

      .get(DocumentTypeResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteDocumentType(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteDocumentTypeCommand(id));
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
      .registerClient(DocumentTypeResolver.name)

      .get(DocumentTypeResolver.name),
    })
  // Queries
  @Query(() => DocumentTypesResponse<DocumentType>)
  async documenttypes(
    options?: FindManyOptions<DocumentType>,
    paginationArgs?: PaginationArgs
  ): Promise<DocumentTypesResponse<DocumentType>> {
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
      .registerClient(DocumentTypeResolver.name)

      .get(DocumentTypeResolver.name),
    })
  @Query(() => DocumentTypesResponse<DocumentType>)
  async documenttype(
    @Args("id", { type: () => String }) id: string
  ): Promise<DocumentTypeResponse<DocumentType>> {
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
      .registerClient(DocumentTypeResolver.name)

      .get(DocumentTypeResolver.name),
    })
  @Query(() => DocumentTypesResponse<DocumentType>)
  async documenttypesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => DocumentTypeValueInput }) value: DocumentTypeValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<DocumentTypesResponse<DocumentType>> {
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
      .registerClient(DocumentTypeResolver.name)

      .get(DocumentTypeResolver.name),
    })
  @Query(() => DocumentTypesResponse<DocumentType>)
  async documenttypesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<DocumentTypesResponse<DocumentType>> {
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
      .registerClient(DocumentTypeResolver.name)

      .get(DocumentTypeResolver.name),
    })
  @Query(() => Number)
  async totalDocumentTypes(): Promise<number> {
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
      .registerClient(DocumentTypeResolver.name)

      .get(DocumentTypeResolver.name),
    })
  @Query(() => DocumentTypesResponse<DocumentType>)
  async searchDocumentTypes(
    @Args("where", { type: () => DocumentTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<DocumentTypesResponse<DocumentType>> {
    const documenttypes = await this.service.findAndCount(where);
    return documenttypes;
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
      .registerClient(DocumentTypeResolver.name)

      .get(DocumentTypeResolver.name),
    })
  @Query(() => DocumentTypeResponse<DocumentType>, { nullable: true })
  async findOneDocumentType(
    @Args("where", { type: () => DocumentTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<DocumentTypeResponse<DocumentType>> {
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
      .registerClient(DocumentTypeResolver.name)

      .get(DocumentTypeResolver.name),
    })
  @Query(() => DocumentTypeResponse<DocumentType>)
  async findOneDocumentTypeOrFail(
    @Args("where", { type: () => DocumentTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<DocumentTypeResponse<DocumentType> | Error> {
    return this.service.findOneOrFail(where);
  }
}

