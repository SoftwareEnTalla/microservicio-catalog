/*
 * Copyright (c) 2025 SoftwarEnTalla
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


import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { IEventBus } from '@nestjs/cqrs';
import { KafkaService } from '../messaging/kafka.service';

@Injectable()
export class KafkaEventSubscriber implements OnModuleInit {
  private readonly logger = new Logger(KafkaEventSubscriber.name);

  constructor(
    private readonly kafkaService: KafkaService,
    private readonly eventBus: IEventBus,
    private readonly eventNames: string[] = []
  ) {}

  async onModuleInit() {
    await this.kafkaService.connect();
    await this.setupSubscriptions();
  }

  private async setupSubscriptions() {
    // Suscribe los eventos de otros microservicios
    await this.kafkaService.subscribe(this.eventNames, (message) => {
      this.routeExternalEvent(message);
    });
  }

  private routeExternalEvent(message: any) {
    try {
      const eventType = message._headers['event-type'];
      if (!eventType) {
        throw new Error('Missing event-type header');
      }

      // Ejemplo: Convierte 'payment-processed' a 'PaymentProcessedEvent'
      const eventClass = this.resolveEventClass(eventType);
      
      if (!eventClass) {
        this.logger.warn(`No handler for event type: ${eventType}`);
        return;
      }

      const event = new eventClass(message);
      this.eventBus.publish(event);
    } catch (error:any) {
      this.logger.error(`Error processing external event: ${error.message}`, error.stack);
    }
  }

  private resolveEventClass(eventType: string): new (...args: any[]) => any {
    // Implementa tu lógica para mapear nombres de evento a clases
    // Puedes usar un registro estático o convenciones de nombres
    const eventMap = {
      //'payment-processed': PaymentProcessedEvent,
      //'inventory-updated': InventoryUpdatedEvent,
      // ...otros eventos
    };

    return eventMap[eventType];
  }
}

