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

import { Injectable, Logger } from "@nestjs/common";
import { KafkaService } from "./kafka.service";

@Injectable()
export class KafkaAdminService {
  private readonly logger = new Logger(KafkaAdminService.name);
  constructor(private readonly kafkaService: KafkaService) {}

  async listAllTopics(): Promise<string[]> {
    const admin = await this.kafkaService.getAdminClient();
    if (admin === null) this.logger.error("Error getting admin client");
    return admin ? await admin.listTopics() : [];
  }

  async createTopicIfNotExists(topicName: string): Promise<void> {
    const admin = await this.kafkaService.getAdminClient();
    if (admin === null) {
      this.logger.error("Error getting admin client");
      return;
    }
    const topics = admin ? await admin.listTopics() : [];
    if (admin && !topics.includes(topicName)) {
      await admin.createTopics({
        topics: [
          {
            topic: topicName,
            numPartitions: 3,
            replicationFactor: 1,
            configEntries: [
              { name: "retention.ms", value: "604800000" }, // 1 semana
            ],
          },
        ],
      });
    }
  }
}


