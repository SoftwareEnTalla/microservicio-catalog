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
  RiskLevelCreatedEvent,
  RiskLevelUpdatedEvent,
  RiskLevelDeletedEvent,

} from '../events/exporting.event';
import {
  SagaRiskLevelFailedEvent
} from '../events/risklevel-failed.event';
import {
  CreateRiskLevelCommand,
  UpdateRiskLevelCommand,
  DeleteRiskLevelCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class RiskLevelCrudSaga {
  private readonly logger = new Logger(RiskLevelCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onRiskLevelCreated = ($events: Observable<RiskLevelCreatedEvent>) => {
    return $events.pipe(
      ofType(RiskLevelCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de RiskLevel: ${event.aggregateId}`);
        void this.handleRiskLevelCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onRiskLevelUpdated = ($events: Observable<RiskLevelUpdatedEvent>) => {
    return $events.pipe(
      ofType(RiskLevelUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de RiskLevel: ${event.aggregateId}`);
        void this.handleRiskLevelUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onRiskLevelDeleted = ($events: Observable<RiskLevelDeletedEvent>) => {
    return $events.pipe(
      ofType(RiskLevelDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de RiskLevel: ${event.aggregateId}`);
        void this.handleRiskLevelDeleted(event);
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
      .registerClient(RiskLevelCrudSaga.name)
      .get(RiskLevelCrudSaga.name),
  })
  private async handleRiskLevelCreated(event: RiskLevelCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga RiskLevel Created completada: ${event.aggregateId}`);
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
      .registerClient(RiskLevelCrudSaga.name)
      .get(RiskLevelCrudSaga.name),
  })
  private async handleRiskLevelUpdated(event: RiskLevelUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga RiskLevel Updated completada: ${event.aggregateId}`);
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
      .registerClient(RiskLevelCrudSaga.name)
      .get(RiskLevelCrudSaga.name),
  })
  private async handleRiskLevelDeleted(event: RiskLevelDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga RiskLevel Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaRiskLevelFailedEvent( error,event));
  }
}
