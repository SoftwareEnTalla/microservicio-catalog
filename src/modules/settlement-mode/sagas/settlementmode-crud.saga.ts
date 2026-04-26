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
  SettlementModeCreatedEvent,
  SettlementModeUpdatedEvent,
  SettlementModeDeletedEvent,

} from '../events/exporting.event';
import {
  SagaSettlementModeFailedEvent
} from '../events/settlementmode-failed.event';
import {
  CreateSettlementModeCommand,
  UpdateSettlementModeCommand,
  DeleteSettlementModeCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class SettlementModeCrudSaga {
  private readonly logger = new Logger(SettlementModeCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onSettlementModeCreated = ($events: Observable<SettlementModeCreatedEvent>) => {
    return $events.pipe(
      ofType(SettlementModeCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de SettlementMode: ${event.aggregateId}`);
        void this.handleSettlementModeCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onSettlementModeUpdated = ($events: Observable<SettlementModeUpdatedEvent>) => {
    return $events.pipe(
      ofType(SettlementModeUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de SettlementMode: ${event.aggregateId}`);
        void this.handleSettlementModeUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onSettlementModeDeleted = ($events: Observable<SettlementModeDeletedEvent>) => {
    return $events.pipe(
      ofType(SettlementModeDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de SettlementMode: ${event.aggregateId}`);
        void this.handleSettlementModeDeleted(event);
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
      .registerClient(SettlementModeCrudSaga.name)
      .get(SettlementModeCrudSaga.name),
  })
  private async handleSettlementModeCreated(event: SettlementModeCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga SettlementMode Created completada: ${event.aggregateId}`);
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
      .registerClient(SettlementModeCrudSaga.name)
      .get(SettlementModeCrudSaga.name),
  })
  private async handleSettlementModeUpdated(event: SettlementModeUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga SettlementMode Updated completada: ${event.aggregateId}`);
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
      .registerClient(SettlementModeCrudSaga.name)
      .get(SettlementModeCrudSaga.name),
  })
  private async handleSettlementModeDeleted(event: SettlementModeDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga SettlementMode Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaSettlementModeFailedEvent( error,event));
  }
}
