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


import { DynamicModule, Module, OnModuleInit, Optional, Inject } from "@nestjs/common";
import { DataSource } from "typeorm";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CatalogCommandController } from "./modules/catalog/controllers/catalogcommand.controller";
import { CatalogModule } from "./modules/catalog/modules/catalog.module";
import { CqrsModule } from "@nestjs/cqrs";
import { AppDataSource, initializeDatabase } from "./data-source";
import { CatalogQueryController } from "./modules/catalog/controllers/catalogquery.controller";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { CatalogCommandService } from "./modules/catalog/services/catalogcommand.service";
import { CatalogQueryService } from "./modules/catalog/services/catalogquery.service";
import { CacheModule } from "@nestjs/cache-manager";
import { LoggingModule } from "./modules/catalog/modules/logger.module";
import { ModuleRef } from "@nestjs/core";
import { ServiceRegistry } from "@core/service-registry";
import LoggerService, { logger } from "@core/logs/logger";
import { CatalogItemHistoryModule } from "./modules/catalog-item-history/modules/catalogitemhistory.module";
import { CatalogCategoryModule } from "./modules/catalog-category/modules/catalogcategory.module";
import { CatalogTranslationModule } from "./modules/catalog-translation/modules/catalogtranslation.module";
import { CatalogItemModule } from "./modules/catalog-item/modules/catalogitem.module";
import { HorizontalModule } from "@common/horizontal";

 

import { NomencladorListenersModule } from './modules/nomenclador-listeners/nomenclador-listeners.module';

@Module({
  imports: [
    // Se importa/registra el módulo de caché
    CacheModule.register(),

    /**
     * ConfigModule - Configuración global de variables de entorno
     *
     * Configuración centralizada para el manejo de variables de entorno.
     * Se establece como global para estar disponible en toda la aplicación.
     */
    ConfigModule.forRoot({
      isGlobal: true, // Disponible en todos los módulos sin necesidad de importar
      envFilePath: ".env", // Ubicación del archivo .env
      cache: true, // Mejora rendimiento cacheando las variables
      expandVariables: true, // Permite usar variables anidadas (ej: )
    }),

    /**
     * TypeOrmModule - Configuración de la base de datos
     *
     * Conexión asíncrona con PostgreSQL y configuración avanzada.
     * Se inicializa primero la conexión a la base de datos.
     */
    // TypeORM solo si INCLUDING_DATA_BASE_SYSTEM=true
    ...(process.env.INCLUDING_DATA_BASE_SYSTEM === 'true'
      ? [
          TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async () => {
              const dataSource = await initializeDatabase();
              return {
                ...dataSource.options,
                autoLoadEntities: true,
                retryAttempts: 5,
                retryDelay: 3000,
                synchronize: process.env.NODE_ENV !== "production",
                logging: process.env.DB_LOGGING === "true",
              };
            },
          }),
        ]
      : []),

    /**
     * Módulos Catalog de la aplicación
     */
    CqrsModule,
    HorizontalModule,
    CatalogModule,
        
    /**
     * Módulo Logger de la aplicación
     */
        CatalogItemHistoryModule,
    CatalogCategoryModule,
    CatalogTranslationModule,
    CatalogItemModule,
    LoggingModule,

    // GraphQL solo si GRAPHQL_ENABLED=true
    ...(process.env.GRAPHQL_ENABLED === 'true'
      ? [
          GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: true,
            buildSchemaOptions: {
              dateScalarMode: "timestamp",
            },
          }),
        ]
      : []),
  
    NomencladorListenersModule,
  ],

  /**
   * Controladores de Catalog
   *
   * Registro de controladores a nivel de aplicación.
   */
  controllers: [
  //No se recomienda habilitar los controladores si ya fueron declarados en el módulo: CatalogModule
  /*
  
  CatalogCommandController, 
  CatalogQueryController
  
  */
  ],

  /**
   * Proveedores (Servicios, Repositorios, etc.) de Catalog
   *
   * Registro de servicios globales y configuración de inyección de dependencias.
   */
  providers: [
    // Configuración de Base de datos
    ...(process.env.INCLUDING_DATA_BASE_SYSTEM === 'true'
      ? [
          {
            provide: DataSource,
            useValue: AppDataSource,
          },
        ]
      : []),
    // Se importan los servicios del módulo
    CatalogCommandService,
    CatalogQueryService,
    LoggerService
  ],

  /**
   * Exportaciones de módulos y servicios
   *
   * Hace disponibles módulos y servicios para otros módulos que importen este módulo.
   */
  exports: [CatalogCommandService, CatalogQueryService,LoggerService],
})
export class CatalogAppModule implements OnModuleInit {
  /**
   * Constructor del módulo principal
   * @param dataSource Instancia inyectada del DataSource
   * @param translocoService Servicio para manejo de idiomas
   */
  constructor(
    private moduleRef: ModuleRef,
    @Optional() @Inject(DataSource) private readonly dataSource?: DataSource
  ) {
    if (process.env.INCLUDING_DATA_BASE_SYSTEM === 'true') {
      this.checkDatabaseConnection();
    }
    this.setupLanguageChangeHandling();
    this.onModuleInit();
  }
  onModuleInit() {
    //Inicializar servicios del microservicio
    ServiceRegistry.getInstance().setModuleRef(this.moduleRef);
    ServiceRegistry.getInstance().registryAll([
      CatalogCommandService,
      CatalogQueryService,
    
    ]);
    const loggerService = ServiceRegistry.getInstance().get(
      "LoggerService"
    ) as LoggerService;
    if (loggerService) 
    loggerService.log(ServiceRegistry.getInstance());
  }
  /**
   * Verifica la conexión a la base de datos al iniciar
   *
   * Realiza una consulta simple para confirmar que la conexión está activa.
   * Termina la aplicación si no puede establecer conexión.
   */
  private async checkDatabaseConnection() {
    try {
      if (!this.dataSource) return;
      await this.dataSource.query("SELECT 1");
      logger.log("✅ Conexión a la base de datos verificada correctamente");
    } catch (error) {
      logger.error(
        "❌ Error crítico: No se pudo conectar a la base de datos",
        error
      );
      process.exit(1); // Termina la aplicación con código de error
    }
  }

  /**
   * Configura el manejo de cambios de idioma
   *
   * Suscribe a eventos de cambio de idioma para mantener consistencia.
   */
  private setupLanguageChangeHandling() {}
}


