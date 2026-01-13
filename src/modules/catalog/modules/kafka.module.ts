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


import { Module, OnModuleInit, Logger } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaService } from "../shared/messaging/kafka.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { KafkaEventSubscriber } from "../shared/adapters/kafka-event-subscriber";

@Module({
  imports: [CqrsModule],
  providers: [
    KafkaService,
    KafkaEventPublisher,
    KafkaEventSubscriber,
    {
      provide: "IEventPublisher",
      useExisting: KafkaEventPublisher,
    },
  ],
  exports: [KafkaService, KafkaEventPublisher, KafkaEventSubscriber],
})
export class KafkaModule implements OnModuleInit {
  private readonly logger = new Logger(KafkaModule.name);

  constructor(
    private readonly kafkaSubscriber: KafkaEventSubscriber,
    private readonly kafkaService: KafkaService
  ) {}

  async onModuleInit() {
    try {
      this.logger.log("Initializing Kafka module...");

      // 1. Conectar a Kafka primero
      await this.kafkaService.connect();
      this.logger.log("Successfully connected to Kafka");

      // 2. Inicializar el suscriptor de eventos
      await this.kafkaSubscriber.onModuleInit();
      this.logger.log("Kafka event subscribers initialized");

      // 3. Opcional: Verificar conexión con un ping
      await this.verifyKafkaConnection();

      this.logger.log("Kafka module initialized successfully");
    } catch (error: any) {
      this.logger.error("Failed to initialize Kafka module", error.stack);

      // Implementar estrategia de reintento si es necesario
      await this.handleInitializationError(error);

      // Relanzar el error para que NestJS lo maneje
      throw error;
    }
  }

  private async verifyKafkaConnection(): Promise<void> {
    try {
      // Verificación básica de conexión
      const admin = await this.kafkaService.getAdminClient(); // Asume que has añadido este método
      if (admin !== null) {
        const topics = await admin.listTopics();
        this.logger.debug(
          `Connected to Kafka. Available topics: ${topics.join(", ")}`
        );
      } else this.logger.error(`Admin instance is null`);
    } catch (error: any) {
      this.logger.warn("Kafka connection verification failed", error.message);
      // No relanzar el error para no bloquear la inicialización
    }
  }

  private async handleInitializationError(error: any): Promise<void> {
    const maxRetries = 3;
    const retryDelay = 5000; // 5 segundos

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      this.logger.warn(
        `Retrying Kafka initialization (attempt ${attempt}/${maxRetries})...`
      );

      try {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        await this.kafkaService.connect();
        await this.kafkaSubscriber.onModuleInit();
        this.logger.log("Kafka module recovered after retry");
        return;
      } catch (retryError: any) {
        this.logger.warn(`Retry attempt ${attempt} failed`, retryError.message);
      }
    }

    this.logger.error(`All ${maxRetries} initialization retries failed`);
  }
}

