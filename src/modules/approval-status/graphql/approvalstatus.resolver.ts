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
import { ApprovalStatus } from "../entities/approval-status.entity";

//Definición de comandos
import {
  CreateApprovalStatusCommand,
  UpdateApprovalStatusCommand,
  DeleteApprovalStatusCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { ApprovalStatusQueryService } from "../services/approvalstatusquery.service";


import { ApprovalStatusResponse, ApprovalStatussResponse } from "../types/approvalstatus.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateApprovalStatusDto, 
CreateOrUpdateApprovalStatusDto, 
ApprovalStatusValueInput, 
ApprovalStatusDto, 
CreateApprovalStatusDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => ApprovalStatus)
export class ApprovalStatusResolver {

   //Constructor del resolver de ApprovalStatus
  constructor(
    private readonly service: ApprovalStatusQueryService,
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
      .registerClient(ApprovalStatusResolver.name)

      .get(ApprovalStatusResolver.name),
    })
  // Mutaciones
  @Mutation(() => ApprovalStatusResponse<ApprovalStatus>)
  async createApprovalStatus(
    @Args("input", { type: () => CreateApprovalStatusDto }) input: CreateApprovalStatusDto
  ): Promise<ApprovalStatusResponse<ApprovalStatus>> {
    return this.commandBus.execute(new CreateApprovalStatusCommand(input));
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
      .registerClient(ApprovalStatusResolver.name)

      .get(ApprovalStatusResolver.name),
    })
  @Mutation(() => ApprovalStatusResponse<ApprovalStatus>)
  async updateApprovalStatus(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateApprovalStatusDto
  ): Promise<ApprovalStatusResponse<ApprovalStatus>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateApprovalStatusCommand(payLoad, {
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
      .registerClient(ApprovalStatusResolver.name)

      .get(ApprovalStatusResolver.name),
    })
  @Mutation(() => ApprovalStatusResponse<ApprovalStatus>)
  async createOrUpdateApprovalStatus(
    @Args("data", { type: () => CreateOrUpdateApprovalStatusDto })
    data: CreateOrUpdateApprovalStatusDto
  ): Promise<ApprovalStatusResponse<ApprovalStatus>> {
    if (data.id) {
      const existingApprovalStatus = await this.service.findById(data.id);
      if (existingApprovalStatus) {
        return this.commandBus.execute(
          new UpdateApprovalStatusCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateApprovalStatusDto | UpdateApprovalStatusDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateApprovalStatusCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateApprovalStatusDto | UpdateApprovalStatusDto).createdBy ||
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
      .registerClient(ApprovalStatusResolver.name)

      .get(ApprovalStatusResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteApprovalStatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteApprovalStatusCommand(id));
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
      .registerClient(ApprovalStatusResolver.name)

      .get(ApprovalStatusResolver.name),
    })
  // Queries
  @Query(() => ApprovalStatussResponse<ApprovalStatus>)
  async approvalstatuss(
    options?: FindManyOptions<ApprovalStatus>,
    paginationArgs?: PaginationArgs
  ): Promise<ApprovalStatussResponse<ApprovalStatus>> {
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
      .registerClient(ApprovalStatusResolver.name)

      .get(ApprovalStatusResolver.name),
    })
  @Query(() => ApprovalStatussResponse<ApprovalStatus>)
  async approvalstatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<ApprovalStatusResponse<ApprovalStatus>> {
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
      .registerClient(ApprovalStatusResolver.name)

      .get(ApprovalStatusResolver.name),
    })
  @Query(() => ApprovalStatussResponse<ApprovalStatus>)
  async approvalstatussByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => ApprovalStatusValueInput }) value: ApprovalStatusValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ApprovalStatussResponse<ApprovalStatus>> {
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
      .registerClient(ApprovalStatusResolver.name)

      .get(ApprovalStatusResolver.name),
    })
  @Query(() => ApprovalStatussResponse<ApprovalStatus>)
  async approvalstatussWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ApprovalStatussResponse<ApprovalStatus>> {
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
      .registerClient(ApprovalStatusResolver.name)

      .get(ApprovalStatusResolver.name),
    })
  @Query(() => Number)
  async totalApprovalStatuss(): Promise<number> {
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
      .registerClient(ApprovalStatusResolver.name)

      .get(ApprovalStatusResolver.name),
    })
  @Query(() => ApprovalStatussResponse<ApprovalStatus>)
  async searchApprovalStatuss(
    @Args("where", { type: () => ApprovalStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<ApprovalStatussResponse<ApprovalStatus>> {
    const approvalstatuss = await this.service.findAndCount(where);
    return approvalstatuss;
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
      .registerClient(ApprovalStatusResolver.name)

      .get(ApprovalStatusResolver.name),
    })
  @Query(() => ApprovalStatusResponse<ApprovalStatus>, { nullable: true })
  async findOneApprovalStatus(
    @Args("where", { type: () => ApprovalStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<ApprovalStatusResponse<ApprovalStatus>> {
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
      .registerClient(ApprovalStatusResolver.name)

      .get(ApprovalStatusResolver.name),
    })
  @Query(() => ApprovalStatusResponse<ApprovalStatus>)
  async findOneApprovalStatusOrFail(
    @Args("where", { type: () => ApprovalStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<ApprovalStatusResponse<ApprovalStatus> | Error> {
    return this.service.findOneOrFail(where);
  }
}

