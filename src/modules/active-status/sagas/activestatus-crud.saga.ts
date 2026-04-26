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
  ActiveStatusCreatedEvent,
  ActiveStatusUpdatedEvent,
  ActiveStatusDeletedEvent,

} from '../events/exporting.event';
import {
  SagaActiveStatusFailedEvent
} from '../events/activestatus-failed.event';
import {
  CreateActiveStatusCommand,
  UpdateActiveStatusCommand,
  DeleteActiveStatusCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class ActiveStatusCrudSaga {
  private readonly logger = new Logger(ActiveStatusCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onActiveStatusCreated = ($events: Observable<ActiveStatusCreatedEvent>) => {
    return $events.pipe(
      ofType(ActiveStatusCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de ActiveStatus: ${event.aggregateId}`);
        void this.handleActiveStatusCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onActiveStatusUpdated = ($events: Observable<ActiveStatusUpdatedEvent>) => {
    return $events.pipe(
      ofType(ActiveStatusUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de ActiveStatus: ${event.aggregateId}`);
        void this.handleActiveStatusUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onActiveStatusDeleted = ($events: Observable<ActiveStatusDeletedEvent>) => {
    return $events.pipe(
      ofType(ActiveStatusDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de ActiveStatus: ${event.aggregateId}`);
        void this.handleActiveStatusDeleted(event);
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
      .registerClient(ActiveStatusCrudSaga.name)
      .get(ActiveStatusCrudSaga.name),
  })
  private async handleActiveStatusCreated(event: ActiveStatusCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga ActiveStatus Created completada: ${event.aggregateId}`);
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
      .registerClient(ActiveStatusCrudSaga.name)
      .get(ActiveStatusCrudSaga.name),
  })
  private async handleActiveStatusUpdated(event: ActiveStatusUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga ActiveStatus Updated completada: ${event.aggregateId}`);
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
      .registerClient(ActiveStatusCrudSaga.name)
      .get(ActiveStatusCrudSaga.name),
  })
  private async handleActiveStatusDeleted(event: ActiveStatusDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga ActiveStatus Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaActiveStatusFailedEvent( error,event));
  }
}
