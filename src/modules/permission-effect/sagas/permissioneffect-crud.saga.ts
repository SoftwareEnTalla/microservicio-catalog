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
  PermissionEffectCreatedEvent,
  PermissionEffectUpdatedEvent,
  PermissionEffectDeletedEvent,

} from '../events/exporting.event';
import {
  SagaPermissionEffectFailedEvent
} from '../events/permissioneffect-failed.event';
import {
  CreatePermissionEffectCommand,
  UpdatePermissionEffectCommand,
  DeletePermissionEffectCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class PermissionEffectCrudSaga {
  private readonly logger = new Logger(PermissionEffectCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onPermissionEffectCreated = ($events: Observable<PermissionEffectCreatedEvent>) => {
    return $events.pipe(
      ofType(PermissionEffectCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de PermissionEffect: ${event.aggregateId}`);
        void this.handlePermissionEffectCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onPermissionEffectUpdated = ($events: Observable<PermissionEffectUpdatedEvent>) => {
    return $events.pipe(
      ofType(PermissionEffectUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de PermissionEffect: ${event.aggregateId}`);
        void this.handlePermissionEffectUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onPermissionEffectDeleted = ($events: Observable<PermissionEffectDeletedEvent>) => {
    return $events.pipe(
      ofType(PermissionEffectDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de PermissionEffect: ${event.aggregateId}`);
        void this.handlePermissionEffectDeleted(event);
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
      .registerClient(PermissionEffectCrudSaga.name)
      .get(PermissionEffectCrudSaga.name),
  })
  private async handlePermissionEffectCreated(event: PermissionEffectCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga PermissionEffect Created completada: ${event.aggregateId}`);
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
      .registerClient(PermissionEffectCrudSaga.name)
      .get(PermissionEffectCrudSaga.name),
  })
  private async handlePermissionEffectUpdated(event: PermissionEffectUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga PermissionEffect Updated completada: ${event.aggregateId}`);
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
      .registerClient(PermissionEffectCrudSaga.name)
      .get(PermissionEffectCrudSaga.name),
  })
  private async handlePermissionEffectDeleted(event: PermissionEffectDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga PermissionEffect Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaPermissionEffectFailedEvent( error,event));
  }
}
