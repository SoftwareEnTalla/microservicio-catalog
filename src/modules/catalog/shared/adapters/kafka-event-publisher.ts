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

import { Injectable } from '@nestjs/common';
import { IEvent, IEventPublisher } from '@nestjs/cqrs';
import { KafkaService } from '../messaging/kafka.service';
import * as dotenv from 'dotenv';
//logger
import { logger } from '@core/logs/logger';

@Injectable()
export class KafkaEventPublisher implements IEventPublisher {
  constructor(private readonly kafkaService: KafkaService) {}

  async publish<T extends IEvent>(event: T) {
    if(process.env.KAFKA_ENABLED && process.env.KAFKA_ENABLED==='true'){
      const topic = this.resolveTopic(event);
      await this.kafkaService.sendMessage(topic, event);
    } 
    else logger.warn(
      `Kafka is disabled. Event not published: ${event.constructor.name}`
    );
  }

  async publishAll(events: IEvent[]) {
    if(process.env.KAFKA_ENABLED && process.env.KAFKA_ENABLED==='true'){
      await Promise.all(events.map(event => this.publish(event)));
    } 
    else logger.warn(
      'Kafka is disabled. Events not published...'
    );
  }

  private resolveTopic(event: IEvent): string {
    // Ejemplo: CreatedEvent -> '-created'
    return event.constructor.name
      .replace(/Event$/, '')
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();
  }
}

