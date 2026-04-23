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


import { Injectable, Logger } from '@nestjs/common';
import { Saga, CommandBus, EventBus, ofType } from '@nestjs/cqrs';
import { Observable, map, tap } from 'rxjs';
import {
  CatalogCategoryCreatedEvent,
  CatalogCategoryUpdatedEvent,
  CatalogCategoryDeletedEvent,
  CatalogCategoryDeprecatedEvent,
} from '../events/exporting.event';
import {
  SagaCatalogCategoryFailedEvent
} from '../events/catalogcategory-failed.event';
import {
  CreateCatalogCategoryCommand,
  UpdateCatalogCategoryCommand,
  DeleteCatalogCategoryCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class CatalogCategoryCrudSaga {
  private readonly logger = new Logger(CatalogCategoryCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onCatalogCategoryCreated = ($events: Observable<CatalogCategoryCreatedEvent>) => {
    return $events.pipe(
      ofType(CatalogCategoryCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de CatalogCategory: ${event.aggregateId}`);
        void this.handleCatalogCategoryCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onCatalogCategoryUpdated = ($events: Observable<CatalogCategoryUpdatedEvent>) => {
    return $events.pipe(
      ofType(CatalogCategoryUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de CatalogCategory: ${event.aggregateId}`);
        void this.handleCatalogCategoryUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onCatalogCategoryDeleted = ($events: Observable<CatalogCategoryDeletedEvent>) => {
    return $events.pipe(
      ofType(CatalogCategoryDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de CatalogCategory: ${event.aggregateId}`);
        void this.handleCatalogCategoryDeleted(event);
      }),
      map(() => null)
    );
  };

  @Saga()
  onCatalogCategoryDeprecated = ($events: Observable<CatalogCategoryDeprecatedEvent>) => {
    return $events.pipe(
      ofType(CatalogCategoryDeprecatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio CatalogCategoryDeprecated: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @LogExecutionTime({
    layer: 'saga',
    callback: async (logData, client) => {
      try {
        logger.info('Codetrace saga event:', [logData, client]);
        return await client.send(logData);
      } catch (error) {
        logger.info('Error enviando traza de saga:', logData);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(CatalogCategoryCrudSaga.name)
      .get(CatalogCategoryCrudSaga.name),
  })
  private async handleCatalogCategoryCreated(event: CatalogCategoryCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga CatalogCategory Created completada: ${event.aggregateId}`);
      // Lógica post-creación (ej: enviar notificación, ejecutar comandos adicionales)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  @LogExecutionTime({
    layer: 'saga',
    callback: async (logData, client) => {
      try {
        logger.info('Codetrace saga event:', [logData, client]);
        return await client.send(logData);
      } catch (error) {
        logger.info('Error enviando traza de saga:', logData);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(CatalogCategoryCrudSaga.name)
      .get(CatalogCategoryCrudSaga.name),
  })
  private async handleCatalogCategoryUpdated(event: CatalogCategoryUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga CatalogCategory Updated completada: ${event.aggregateId}`);
      // Lógica post-actualización (ej: actualizar caché)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  @LogExecutionTime({
    layer: 'saga',
    callback: async (logData, client) => {
      try {
        logger.info('Codetrace saga event:', [logData, client]);
        return await client.send(logData);
      } catch (error) {
        logger.info('Error enviando traza de saga:', logData);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(CatalogCategoryCrudSaga.name)
      .get(CatalogCategoryCrudSaga.name),
  })
  private async handleCatalogCategoryDeleted(event: CatalogCategoryDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga CatalogCategory Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaCatalogCategoryFailedEvent( error,event));
  }
}
