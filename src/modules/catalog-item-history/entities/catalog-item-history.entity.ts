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

import { Column, Entity, OneToOne, JoinColumn, ChildEntity, ManyToOne, OneToMany, ManyToMany, JoinTable, Index, Check, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CreateCatalogItemHistoryDto, UpdateCatalogItemHistoryDto, DeleteCatalogItemHistoryDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';


@Index('idx_catalog_item_history_item', ['catalogItemId'])
@Index('idx_catalog_item_history_item_version', ['catalogItemId', 'version'], { unique: true })
@Unique('uq_catalog_item_history_version', ['catalogItemId', 'version'])
@ChildEntity('catalogitemhistory')
@ObjectType()
export class CatalogItemHistory extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de CatalogItemHistory",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de CatalogItemHistory", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia CatalogItemHistory' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de CatalogItemHistory",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de CatalogItemHistory", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia CatalogItemHistory' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Ítem versionado',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Ítem versionado', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Ítem versionado' })
  catalogItemId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Categoría',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Categoría', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 80, comment: 'Categoría' })
  categoryCode!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código del ítem',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código del ítem', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 80, comment: 'Código del ítem' })
  itemCode!: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Versión capturada',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Versión capturada', nullable: false })
  @Column({ type: 'int', nullable: false, comment: 'Versión capturada' })
  version!: number;

  @ApiProperty({
    type: () => Object,
    nullable: false,
    description: 'Snapshot completo del ítem',
  })
  @IsObject()
  @IsNotEmpty()
  @Field(() => GraphQLJSON, { description: 'Snapshot completo del ítem', nullable: false })
  @Column({ type: 'json', nullable: false, comment: 'Snapshot completo del ítem' })
  snapshot!: Record<string, any>;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Usuario que realizó el cambio',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Usuario que realizó el cambio', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Usuario que realizó el cambio' })
  changedBy!: string;

  @ApiProperty({
    type: () => Date,
    nullable: false,
    description: 'Momento del cambio',
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { description: 'Momento del cambio', nullable: false })
  @Column({ type: 'timestamp', nullable: false, comment: 'Momento del cambio' })
  changedAt!: Date;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Diff respecto de la versión anterior',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Diff respecto de la versión anterior', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Diff respecto de la versión anterior' })
  diff?: Record<string, any> = {};

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Motivo del cambio',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Motivo del cambio', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 500, comment: 'Motivo del cambio' })
  reason?: string = '';

  protected executeDslLifecycle(): void {
    // Rule: history-requires-item
    // El histórico requiere catalogItemId.
    if (!(!(this.catalogItemId === undefined || this.catalogItemId === null || (typeof this.catalogItemId === 'string' && String(this.catalogItemId).trim() === '') || (Array.isArray(this.catalogItemId) && this.catalogItemId.length === 0) || (typeof this.catalogItemId === 'object' && !Array.isArray(this.catalogItemId) && Object.prototype.toString.call(this.catalogItemId) === '[object Object]' && Object.keys(Object(this.catalogItemId)).length === 0)))) {
      throw new Error('CAT_HIST_001: catalogItemId requerido');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'catalogitemhistory';
  }

  // Getters y Setters
  get getName(): string {
    return this.name;
  }
  set setName(value: string) {
    this.name = value;
  }
  get getDescription(): string {
    return this.description;
  }

  // Métodos abstractos implementados
  async create(data: any): Promise<BaseEntity> {
    Object.assign(this, data);
    this.executeDslLifecycle();
    this.modificationDate = new Date();
    return this;
  }
  async update(data: any): Promise<BaseEntity> {
    Object.assign(this, data);
    this.executeDslLifecycle();
    this.modificationDate = new Date();
    return this;
  }
  async delete(id: string): Promise<BaseEntity> {
    this.id = id;
    return this;
  }

  // Método estático para convertir DTOs a entidad con sobrecarga
  static fromDto(dto: CreateCatalogItemHistoryDto): CatalogItemHistory;
  static fromDto(dto: UpdateCatalogItemHistoryDto): CatalogItemHistory;
  static fromDto(dto: DeleteCatalogItemHistoryDto): CatalogItemHistory;
  static fromDto(dto: any): CatalogItemHistory {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(CatalogItemHistory, dto);
  }
}
