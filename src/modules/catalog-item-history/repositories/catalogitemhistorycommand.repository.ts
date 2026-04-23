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
import { CatalogItemHistory } from '../entities/catalog-item-history.entity';
import { CatalogItemHistoryQueryRepository } from './catalogitemhistoryquery.repository';
import { generateCacheKey } from 'src/utils/functions';
import { Cacheable } from '../decorators/cache.decorator';
import {CatalogItemHistoryRepository} from './catalogitemhistory.repository';

//Logger
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

//Events and EventHandlers
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { CatalogItemHistoryCreatedEvent } from '../events/catalogitemhistorycreated.event';
import { CatalogItemHistoryUpdatedEvent } from '../events/catalogitemhistoryupdated.event';
import { CatalogItemHistoryDeletedEvent } from '../events/catalogitemhistorydeleted.event';
import { CatalogItemVersionRecordedEvent } from "../events/catalogitemversionrecorded.event";

//Enfoque Event Sourcing
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { EventStoreService } from '../shared/event-store/event-store.service';
import { KafkaEventPublisher } from '../shared/adapters/kafka-event-publisher';
import { BaseEvent } from '../events/base.event';

//Event Sourcing Config
import { EventSourcingHelper } from '../shared/decorators/event-sourcing.helper';
import { EventSourcingConfigOptions } from '../shared/decorators/event-sourcing.decorator';


@EventsHandler(CatalogItemHistoryCreatedEvent, CatalogItemHistoryUpdatedEvent, CatalogItemHistoryDeletedEvent, CatalogItemVersionRecordedEvent)
@Injectable()
export class CatalogItemHistoryCommandRepository implements IEventHandler<BaseEvent>{

  //Constructor del repositorio de datos: CatalogItemHistoryCommandRepository
  constructor(
    @InjectRepository(CatalogItemHistory)
    private readonly repository: Repository<CatalogItemHistory>,
    private readonly catalogitemhistoryRepository: CatalogItemHistoryQueryRepository,
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
      .registerClient(CatalogItemHistoryRepository.name)
      .get(CatalogItemHistoryRepository.name),
  })
  private validate(): void {
    const entityInstance = Object.create(CatalogItemHistory.prototype);

    if (!(entityInstance instanceof BaseEntity)) {
      throw new Error(
        `El tipo ${CatalogItemHistory.name} no extiende de BaseEntity. Asegúrate de que todas las entidades hereden correctamente.`
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
      .registerClient(CatalogItemHistoryRepository.name)
      .get(CatalogItemHistoryRepository.name),
  })
  async handle(event: any) {
    // Solo manejar eventos si las proyecciones están habilitadas
    if (!this.shouldUseProjections()) {
      logger.debug('Projections are disabled, skipping event handling');
      return false;
    }
    
    logger.info('Ready to handle CatalogItemHistory event on repository:', event);
    switch (event.constructor.name) {
      case 'CatalogItemHistoryCreatedEvent':
        return await this.onCatalogItemHistoryCreated(event);
      case 'CatalogItemHistoryUpdatedEvent':
        return await this.onCatalogItemHistoryUpdated(event);
      case 'CatalogItemHistoryDeletedEvent':
        return await this.onCatalogItemHistoryDeleted(event);
      case 'CatalogItemVersionRecordedEvent':
        return await this.onCatalogItemVersionRecorded(event);
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
      .registerClient(CatalogItemHistoryRepository.name)
      .get(CatalogItemHistoryRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<CatalogItemHistory>('createCatalogItemHistory', args[0], args[1]),
    ttl: 60,
  })
  private async onCatalogItemHistoryCreated(event: CatalogItemHistoryCreatedEvent) {
    logger.info('Ready to handle onCatalogItemHistoryCreated event on repository:', event);
    const entity = new CatalogItemHistory();
    entity.id = event.aggregateId;
    Object.assign(entity, event.payload.instance);
    // Asegurar que el tipo discriminador esté establecido
    if (!entity.type) {
      entity.type = 'catalogitemhistory';
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
      .registerClient(CatalogItemHistoryRepository.name)
      .get(CatalogItemHistoryRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<CatalogItemHistory>('updateCatalogItemHistory', args[0], args[1]),
    ttl: 60,
  })
  private async onCatalogItemHistoryUpdated(event: CatalogItemHistoryUpdatedEvent) {
    logger.info('Ready to handle onCatalogItemHistoryUpdated event on repository:', event);
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
      .registerClient(CatalogItemHistoryRepository.name)
      .get(CatalogItemHistoryRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<CatalogItemHistory>('deleteCatalogItemHistory', args[0], args[1]),
    ttl: 60,
  })
  private async onCatalogItemHistoryDeleted(event: CatalogItemHistoryDeletedEvent) {
    logger.info('Ready to handle onCatalogItemHistoryDeleted event on repository:', event);
    return await this.repository.delete(event.aggregateId);
  }

  private async onCatalogItemVersionRecorded(event: CatalogItemVersionRecordedEvent) {
    logger.info('Ready to handle onCatalogItemVersionRecorded event on repository:', event);
    const payloadInstance = (event as any).payload?.instance;
    if (payloadInstance) {
      const projectedEntity = this.repository.create({
        ...(payloadInstance as any),
        id: event.aggregateId,
        type: 'catalog-item-history'
      } as Partial<CatalogItemHistory>);
      return await this.repository.save(projectedEntity as CatalogItemHistory);
    }
    return true;
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
      .registerClient(CatalogItemHistoryRepository.name)
      .get(CatalogItemHistoryRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<CatalogItemHistory>('createCatalogItemHistory',args[0], args[1]), ttl: 60 })
  async create(entity: CatalogItemHistory): Promise<CatalogItemHistory> {
    logger.info('Ready to create CatalogItemHistory on repository:', entity);
    
    // Asegurar que el tipo discriminador esté establecido antes de guardar
    if (!entity.type) {
      entity.type = 'catalogitemhistory';
    }
    
    const result = await this.repository.save(entity);
    logger.info('New instance of CatalogItemHistory was created with id:'+ result.id+' on repository:', result);
    
    // Publicar evento al EventBus local (sagas) y a Kafka si está habilitado
    if (this.shouldPublishEvent()) {
      const event = new CatalogItemHistoryCreatedEvent(result.id, {
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
      .registerClient(CatalogItemHistoryRepository.name)
      .get(CatalogItemHistoryRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<CatalogItemHistory[]>('createCatalogItemHistorys',args[0], args[1]), ttl: 60 })
  async bulkCreate(entities: CatalogItemHistory[]): Promise<CatalogItemHistory[]> {
    logger.info('Ready to create CatalogItemHistory on repository:', entities);
    
    // Asegurar que el tipo discriminador esté establecido para todas las entidades
    entities.forEach(entity => {
      if (!entity.type) {
        entity.type = 'catalogitemhistory';
      }
    });
    
    const result = await this.repository.save(entities);
    logger.info('New '+entities.length+' instances of CatalogItemHistory was created on repository:', result);
    
    // Publicar eventos al EventBus local (sagas) y a Kafka si está habilitado
    if (this.shouldPublishEvent()) {
      const events = result.map((el) => new CatalogItemHistoryCreatedEvent(el.id, {
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
      .registerClient(CatalogItemHistoryRepository.name)
      .get(CatalogItemHistoryRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<CatalogItemHistory>('updateCatalogItemHistory',args[0], args[1]), ttl: 60 })
  async update(
    id: string,
    partialEntity: Partial<CatalogItemHistory>
  ): Promise<CatalogItemHistory | null> {
    logger.info('Ready to update CatalogItemHistory on repository:', partialEntity);
    let result = await this.repository.update(id, partialEntity);
    logger.info('update CatalogItemHistory on repository was successfully :', partialEntity);
    let instance=await this.catalogitemhistoryRepository.findById(id);
    logger.info('Updated instance of CatalogItemHistory with id: ${id} was finded on repository:', instance);
    
    if(instance && this.shouldPublishEvent()) {
      logger.info('Ready to publish or fire event CatalogItemHistoryUpdatedEvent on repository:', instance);
      const event = new CatalogItemHistoryUpdatedEvent(instance.id, {
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
      .registerClient(CatalogItemHistoryRepository.name)
      .get(CatalogItemHistoryRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<CatalogItemHistory[]>('updateCatalogItemHistorys',args[0], args[1]), ttl: 60 })
  async bulkUpdate(entities: Partial<CatalogItemHistory>[]): Promise<CatalogItemHistory[]> {
    const updatedEntities: CatalogItemHistory[] = [];
    logger.info('Ready to update '+entities.length+' entities on repository:', entities);
    
    for (const entity of entities) {
      if (entity.id) {
        const updatedEntity = await this.update(entity.id, entity);
        if (updatedEntity) {
          updatedEntities.push(updatedEntity);
          if (this.shouldPublishEvent()) {
            const updateEvent = new CatalogItemHistoryUpdatedEvent(updatedEntity.id, {
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
      .registerClient(CatalogItemHistoryRepository.name)
      .get(CatalogItemHistoryRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<string>('deleteCatalogItemHistory',args[0]), ttl: 60 })
  async delete(id: string): Promise<DeleteResult> {
     logger.info('Ready to delete entity with id: ${id} on repository:', id);
     const entity = await this.catalogitemhistoryRepository.findOne({ id });
     if(!entity){
      throw new NotFoundException(`No se encontro el id: ${id}`);
     }
     const result = await this.repository.delete({ id });
     logger.info('Entity deleted with id: ${id} on repository:', result);
     
     if (this.shouldPublishEvent()) {
       logger.info('Ready to publish/fire CatalogItemHistoryDeletedEvent on repository:', result);
       const event = new CatalogItemHistoryDeletedEvent(id, {
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
      .registerClient(CatalogItemHistoryRepository.name)
      .get(CatalogItemHistoryRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<string[]>('deleteCatalogItemHistorys',args[0]), ttl: 60 })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    logger.info('Ready to delete '+ids.length+' entities on repository:', ids);
    const result = await this.repository.delete(ids);
    logger.info('Already deleted '+ids.length+' entities on repository:', result);
    
    if (this.shouldPublishEvent()) {
      logger.info('Ready to publish/fire CatalogItemHistoryDeletedEvent on repository:', result);
      const deleteEvents = await Promise.all(ids.map(async (id) => {
          const entity = await this.catalogitemhistoryRepository.findOne({ id });
          if(!entity){
            throw new NotFoundException(`No se encontro el id: ${id}`);
          }
          return new CatalogItemHistoryDeletedEvent(id, {
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


