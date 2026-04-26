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
  ApprovalStatusCreatedEvent,
  ApprovalStatusUpdatedEvent,
  ApprovalStatusDeletedEvent,

} from '../events/exporting.event';
import {
  SagaApprovalStatusFailedEvent
} from '../events/approvalstatus-failed.event';
import {
  CreateApprovalStatusCommand,
  UpdateApprovalStatusCommand,
  DeleteApprovalStatusCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class ApprovalStatusCrudSaga {
  private readonly logger = new Logger(ApprovalStatusCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onApprovalStatusCreated = ($events: Observable<ApprovalStatusCreatedEvent>) => {
    return $events.pipe(
      ofType(ApprovalStatusCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de ApprovalStatus: ${event.aggregateId}`);
        void this.handleApprovalStatusCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onApprovalStatusUpdated = ($events: Observable<ApprovalStatusUpdatedEvent>) => {
    return $events.pipe(
      ofType(ApprovalStatusUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de ApprovalStatus: ${event.aggregateId}`);
        void this.handleApprovalStatusUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onApprovalStatusDeleted = ($events: Observable<ApprovalStatusDeletedEvent>) => {
    return $events.pipe(
      ofType(ApprovalStatusDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de ApprovalStatus: ${event.aggregateId}`);
        void this.handleApprovalStatusDeleted(event);
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
      .registerClient(ApprovalStatusCrudSaga.name)
      .get(ApprovalStatusCrudSaga.name),
  })
  private async handleApprovalStatusCreated(event: ApprovalStatusCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga ApprovalStatus Created completada: ${event.aggregateId}`);
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
      .registerClient(ApprovalStatusCrudSaga.name)
      .get(ApprovalStatusCrudSaga.name),
  })
  private async handleApprovalStatusUpdated(event: ApprovalStatusUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga ApprovalStatus Updated completada: ${event.aggregateId}`);
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
      .registerClient(ApprovalStatusCrudSaga.name)
      .get(ApprovalStatusCrudSaga.name),
  })
  private async handleApprovalStatusDeleted(event: ApprovalStatusDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga ApprovalStatus Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaApprovalStatusFailedEvent( error,event));
  }
}
