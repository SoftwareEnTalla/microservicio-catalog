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
import { Injectable, NotFoundException, Optional, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  Repository,
  UpdateResult,
} from 'typeorm';


import { BaseEntity } from '../entities/base.entity';
import { UpstreamSyncStatus } from '../entities/upstream-sync-status.entity';
import { UpstreamSyncStatusQueryRepository } from './upstreamsyncstatusquery.repository';
import { generateCacheKey } from 'src/utils/functions';
import { Cacheable } from '../decorators/cache.decorator';
import {UpstreamSyncStatusRepository} from './upstreamsyncstatus.repository';

//Logger
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

//Events and EventHandlers
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { UpstreamSyncStatusCreatedEvent } from '../events/upstreamsyncstatuscreated.event';
import { UpstreamSyncStatusUpdatedEvent } from '../events/upstreamsyncstatusupdated.event';
import { UpstreamSyncStatusDeletedEvent } from '../events/upstreamsyncstatusdeleted.event';


//Enfoque Event Sourcing
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { EventStoreService } from '../shared/event-store/event-store.service';
import { KafkaEventPublisher } from '../shared/adapters/kafka-event-publisher';
import { BaseEvent } from '../events/base.event';

//Event Sourcing Config
import { EventSourcingHelper } from '../shared/decorators/event-sourcing.helper';
import { EventSourcingConfigOptions } from '../shared/decorators/event-sourcing.decorator';


@EventsHandler(UpstreamSyncStatusCreatedEvent, UpstreamSyncStatusUpdatedEvent, UpstreamSyncStatusDeletedEvent)
@Injectable()
export class UpstreamSyncStatusCommandRepository implements IEventHandler<BaseEvent>{

  //Constructor del repositorio de datos: UpstreamSyncStatusCommandRepository
  constructor(
    @InjectRepository(UpstreamSyncStatus)
    private readonly repository: Repository<UpstreamSyncStatus>,
    private readonly upstreamsyncstatusRepository: UpstreamSyncStatusQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly eventStore: EventStoreService,
    private readonly eventPublisher: KafkaEventPublisher,
    private readonly eventBus: EventBus,
    @Optional() @Inject('EVENT_SOURCING_CONFIG') 
    private readonly eventSourcingConfig: EventSourcingConfigOptions = EventSourcingHelper.getDefaultConfig()
  ) {
    this.validate();
  }

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(UpstreamSyncStatusRepository.name)
      .get(UpstreamSyncStatusRepository.name),
  })
  private validate(): void {
    const entityInstance = Object.create(UpstreamSyncStatus.prototype);

    if (!(entityInstance instanceof BaseEntity)) {
      throw new Error(
        `El tipo ${UpstreamSyncStatus.name} no extiende de BaseEntity. Asegúrate de que todas las entidades hereden correctamente.`
      );
    }
  }

  // Helper para determinar si usar Event Sourcing
  private shouldPublishEvent(): boolean {
    return EventSourcingHelper.shouldPublishEvents(this.eventSourcingConfig);
  }

  private shouldUseProjections(): boolean {
    return EventSourcingHelper.shouldUseProjections(this.eventSourcingConfig);
  }


  // ----------------------------
  // MÉTODOS DE PROYECCIÓN (Event Handlers) para enfoque Event Sourcing
  // ----------------------------

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(UpstreamSyncStatusRepository.name)
      .get(UpstreamSyncStatusRepository.name),
  })
  async handle(event: any) {
    // Solo manejar eventos si las proyecciones están habilitadas
    if (!this.shouldUseProjections()) {
      logger.debug('Projections are disabled, skipping event handling');
      return false;
    }
    
    logger.info('Ready to handle UpstreamSyncStatus event on repository:', event);
    switch (event.constructor.name) {
      case 'UpstreamSyncStatusCreatedEvent':
        return await this.onUpstreamSyncStatusCreated(event);
      case 'UpstreamSyncStatusUpdatedEvent':
        return await this.onUpstreamSyncStatusUpdated(event);
      case 'UpstreamSyncStatusDeletedEvent':
        return await this.onUpstreamSyncStatusDeleted(event);

    }
    return false;
  }

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(UpstreamSyncStatusRepository.name)
      .get(UpstreamSyncStatusRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<UpstreamSyncStatus>('createUpstreamSyncStatus', args[0], args[1]),
    ttl: 60,
  })
  private async onUpstreamSyncStatusCreated(event: UpstreamSyncStatusCreatedEvent) {
    logger.info('Ready to handle onUpstreamSyncStatusCreated event on repository:', event);
    const entity = new UpstreamSyncStatus();
    entity.id = event.aggregateId;
    Object.assign(entity, event.payload.instance);
    // Asegurar que el tipo discriminador esté establecido
    if (!entity.type) {
      entity.type = 'upstreamsyncstatus';
    }
    logger.info('Ready to save entity from event\'s payload:', entity);
    return await this.repository.save(entity);
  }

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(UpstreamSyncStatusRepository.name)
      .get(UpstreamSyncStatusRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<UpstreamSyncStatus>('updateUpstreamSyncStatus', args[0], args[1]),
    ttl: 60,
  })
  private async onUpstreamSyncStatusUpdated(event: UpstreamSyncStatusUpdatedEvent) {
    logger.info('Ready to handle onUpstreamSyncStatusUpdated event on repository:', event);
    return await this.repository.update(
      event.aggregateId,
      event.payload.instance
    );
  }

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(UpstreamSyncStatusRepository.name)
      .get(UpstreamSyncStatusRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<UpstreamSyncStatus>('deleteUpstreamSyncStatus', args[0], args[1]),
    ttl: 60,
  })
  private async onUpstreamSyncStatusDeleted(event: UpstreamSyncStatusDeletedEvent) {
    logger.info('Ready to handle onUpstreamSyncStatusDeleted event on repository:', event);
    return await this.repository.delete(event.aggregateId);
  }



  // ----------------------------
  // MÉTODOS CRUD TRADICIONALES (Compatibilidad)
  // ----------------------------
 
  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(UpstreamSyncStatusRepository.name)
      .get(UpstreamSyncStatusRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<UpstreamSyncStatus>('createUpstreamSyncStatus',args[0], args[1]), ttl: 60 })
  async create(entity: UpstreamSyncStatus): Promise<UpstreamSyncStatus> {
    logger.info('Ready to create UpstreamSyncStatus on repository:', entity);
    
    // Asegurar que el tipo discriminador esté establecido antes de guardar
    if (!entity.type) {
      entity.type = 'upstreamsyncstatus';
    }
    
    const result = await this.repository.save(entity);
    logger.info('New instance of UpstreamSyncStatus was created with id:'+ result.id+' on repository:', result);
    
    // Publicar evento al EventBus local (sagas) y a Kafka si está habilitado
    if (this.shouldPublishEvent()) {
      const event = new UpstreamSyncStatusCreatedEvent(result.id, {
        instance: result,
        metadata: {
          initiatedBy: result.creator,
          correlationId: result.id,
        },
      });
      this.eventBus.publish(event);
      this.eventPublisher.publish(event);
    }
    return result;
  }


  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(UpstreamSyncStatusRepository.name)
      .get(UpstreamSyncStatusRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<UpstreamSyncStatus[]>('createUpstreamSyncStatuss',args[0], args[1]), ttl: 60 })
  async bulkCreate(entities: UpstreamSyncStatus[]): Promise<UpstreamSyncStatus[]> {
    logger.info('Ready to create UpstreamSyncStatus on repository:', entities);
    
    // Asegurar que el tipo discriminador esté establecido para todas las entidades
    entities.forEach(entity => {
      if (!entity.type) {
        entity.type = 'upstreamsyncstatus';
      }
    });
    
    const result = await this.repository.save(entities);
    logger.info('New '+entities.length+' instances of UpstreamSyncStatus was created on repository:', result);
    
    // Publicar eventos al EventBus local (sagas) y a Kafka si está habilitado
    if (this.shouldPublishEvent()) {
      const events = result.map((el) => new UpstreamSyncStatusCreatedEvent(el.id, {
        instance: el,
        metadata: {
          initiatedBy: el.creator,
          correlationId: el.id,
        },
      }));
      events.forEach(event => this.eventBus.publish(event));
      this.eventPublisher.publishAll(events);
    }
    return result;
  }

  
  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(UpstreamSyncStatusRepository.name)
      .get(UpstreamSyncStatusRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<UpstreamSyncStatus>('updateUpstreamSyncStatus',args[0], args[1]), ttl: 60 })
  async update(
    id: string,
    partialEntity: Partial<UpstreamSyncStatus>
  ): Promise<UpstreamSyncStatus | null> {
    logger.info('Ready to update UpstreamSyncStatus on repository:', partialEntity);
    let result = await this.repository.update(id, partialEntity);
    logger.info('update UpstreamSyncStatus on repository was successfully :', partialEntity);
    let instance=await this.upstreamsyncstatusRepository.findById(id);
    logger.info('Updated instance of UpstreamSyncStatus with id: ${id} was finded on repository:', instance);
    
    if(instance && this.shouldPublishEvent()) {
      logger.info('Ready to publish or fire event UpstreamSyncStatusUpdatedEvent on repository:', instance);
      const event = new UpstreamSyncStatusUpdatedEvent(instance.id, {
          instance: instance,
          metadata: {
            initiatedBy: instance.createdBy || 'system',
            correlationId: id,
          },
        });
      this.eventBus.publish(event);
      this.eventPublisher.publish(event);
    }   
    return instance;
  }


  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(UpstreamSyncStatusRepository.name)
      .get(UpstreamSyncStatusRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<UpstreamSyncStatus[]>('updateUpstreamSyncStatuss',args[0], args[1]), ttl: 60 })
  async bulkUpdate(entities: Partial<UpstreamSyncStatus>[]): Promise<UpstreamSyncStatus[]> {
    const updatedEntities: UpstreamSyncStatus[] = [];
    logger.info('Ready to update '+entities.length+' entities on repository:', entities);
    
    for (const entity of entities) {
      if (entity.id) {
        const updatedEntity = await this.update(entity.id, entity);
        if (updatedEntity) {
          updatedEntities.push(updatedEntity);
          if (this.shouldPublishEvent()) {
            const updateEvent = new UpstreamSyncStatusUpdatedEvent(updatedEntity.id, {
                instance: updatedEntity,
                metadata: {
                  initiatedBy: updatedEntity.createdBy || 'system',
                  correlationId: entity.id,
                },
              });
            this.eventBus.publish(updateEvent);
            this.eventPublisher.publish(updateEvent);
          }
        }
      }
    }
    logger.info('Already updated '+updatedEntities.length+' entities on repository:', updatedEntities);
    return updatedEntities;
  }


  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(UpstreamSyncStatusRepository.name)
      .get(UpstreamSyncStatusRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<string>('deleteUpstreamSyncStatus',args[0]), ttl: 60 })
  async delete(id: string): Promise<DeleteResult> {
     logger.info('Ready to delete entity with id: ${id} on repository:', id);
     const entity = await this.upstreamsyncstatusRepository.findOne({ id });
     if(!entity){
      throw new NotFoundException(`No se encontro el id: ${id}`);
     }
     const result = await this.repository.delete({ id });
     logger.info('Entity deleted with id: ${id} on repository:', result);
     
     if (this.shouldPublishEvent()) {
       logger.info('Ready to publish/fire UpstreamSyncStatusDeletedEvent on repository:', result);
       const event = new UpstreamSyncStatusDeletedEvent(id, {
        instance: entity,
        metadata: {
          initiatedBy: entity.createdBy || 'system',
          correlationId: entity.id,
        },
      });
       this.eventBus.publish(event);
       this.eventPublisher.publish(event);
     }
     return result;
  }


  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(UpstreamSyncStatusRepository.name)
      .get(UpstreamSyncStatusRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<string[]>('deleteUpstreamSyncStatuss',args[0]), ttl: 60 })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    logger.info('Ready to delete '+ids.length+' entities on repository:', ids);
    const result = await this.repository.delete(ids);
    logger.info('Already deleted '+ids.length+' entities on repository:', result);
    
    if (this.shouldPublishEvent()) {
      logger.info('Ready to publish/fire UpstreamSyncStatusDeletedEvent on repository:', result);
      const deleteEvents = await Promise.all(ids.map(async (id) => {
          const entity = await this.upstreamsyncstatusRepository.findOne({ id });
          if(!entity){
            throw new NotFoundException(`No se encontro el id: ${id}`);
          }
          return new UpstreamSyncStatusDeletedEvent(id, {
            instance: entity,
            metadata: {
              initiatedBy: entity.createdBy || 'system',
              correlationId: entity.id,
            },
          });
        }));
      deleteEvents.forEach(event => this.eventBus.publish(event));
      this.eventPublisher.publishAll(deleteEvents);
    }
    return result;
  }
}


