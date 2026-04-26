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
  DocumentTypeCreatedEvent,
  DocumentTypeUpdatedEvent,
  DocumentTypeDeletedEvent,

} from '../events/exporting.event';
import {
  SagaDocumentTypeFailedEvent
} from '../events/documenttype-failed.event';
import {
  CreateDocumentTypeCommand,
  UpdateDocumentTypeCommand,
  DeleteDocumentTypeCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class DocumentTypeCrudSaga {
  private readonly logger = new Logger(DocumentTypeCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onDocumentTypeCreated = ($events: Observable<DocumentTypeCreatedEvent>) => {
    return $events.pipe(
      ofType(DocumentTypeCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de DocumentType: ${event.aggregateId}`);
        void this.handleDocumentTypeCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onDocumentTypeUpdated = ($events: Observable<DocumentTypeUpdatedEvent>) => {
    return $events.pipe(
      ofType(DocumentTypeUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de DocumentType: ${event.aggregateId}`);
        void this.handleDocumentTypeUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onDocumentTypeDeleted = ($events: Observable<DocumentTypeDeletedEvent>) => {
    return $events.pipe(
      ofType(DocumentTypeDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de DocumentType: ${event.aggregateId}`);
        void this.handleDocumentTypeDeleted(event);
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
      .registerClient(DocumentTypeCrudSaga.name)
      .get(DocumentTypeCrudSaga.name),
  })
  private async handleDocumentTypeCreated(event: DocumentTypeCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga DocumentType Created completada: ${event.aggregateId}`);
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
      .registerClient(DocumentTypeCrudSaga.name)
      .get(DocumentTypeCrudSaga.name),
  })
  private async handleDocumentTypeUpdated(event: DocumentTypeUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga DocumentType Updated completada: ${event.aggregateId}`);
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
      .registerClient(DocumentTypeCrudSaga.name)
      .get(DocumentTypeCrudSaga.name),
  })
  private async handleDocumentTypeDeleted(event: DocumentTypeDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga DocumentType Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaDocumentTypeFailedEvent( error,event));
  }
}
