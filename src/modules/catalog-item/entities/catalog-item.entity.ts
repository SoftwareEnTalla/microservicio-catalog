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
import { CreateCatalogItemDto, UpdateCatalogItemDto, DeleteCatalogItemDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';


@Index('idx_catalog_item_category_code', ['categoryCode', 'itemCode'], { unique: true })
@Index('idx_catalog_item_status', ['status'])
@Unique('uq_catalog_item_code', ['categoryCode', 'itemCode'])
@ChildEntity('catalogitem')
@ObjectType()
export class CatalogItem extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de CatalogItem",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de CatalogItem", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia CatalogItem' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de CatalogItem",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de CatalogItem", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia CatalogItem' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Categoría a la que pertenece',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Categoría a la que pertenece', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Categoría a la que pertenece' })
  categoryId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código de la categoría (denormalizado)',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código de la categoría (denormalizado)', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 80, comment: 'Código de la categoría (denormalizado)' })
  categoryCode!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código único por categoría (ej. MXN)',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código único por categoría (ej. MXN)', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 80, comment: 'Código único por categoría (ej. MXN)' })
  itemCode!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Etiqueta por defecto (locale en)',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Etiqueta por defecto (locale en)', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 200, comment: 'Etiqueta por defecto (locale en)' })
  label!: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Orden de presentación',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Orden de presentación', nullable: false })
  @Column({ type: 'int', nullable: false, default: 0, comment: 'Orden de presentación' })
  sortOrder!: number;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Ítem por defecto de la categoría',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Ítem por defecto de la categoría', nullable: false })
  @Column({ type: 'boolean', nullable: false, default: false, comment: 'Ítem por defecto de la categoría' })
  isDefault!: boolean;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado del ítem',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado del ítem', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'ACTIVE', comment: 'Estado del ítem' })
  status!: string;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Vigente desde',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Vigente desde', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Vigente desde' })
  validFrom?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Vigente hasta',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Vigente hasta', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Vigente hasta' })
  validTo?: Date = new Date();

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Versión incremental del ítem',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Versión incremental del ítem', nullable: false })
  @Column({ type: 'int', nullable: false, default: 1, comment: 'Versión incremental del ítem' })
  version!: number;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos libres (símbolo de moneda, alpha3, etc.)',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos libres (símbolo de moneda, alpha3, etc.)', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Metadatos libres (símbolo de moneda, alpha3, etc.)' })
  metadata?: Record<string, any> = {};

  protected executeDslLifecycle(): void {
    // Rule: item-requires-category
    // El ítem requiere categoryId.
    if (!(!(this.categoryId === undefined || this.categoryId === null || (typeof this.categoryId === 'string' && String(this.categoryId).trim() === '') || (Array.isArray(this.categoryId) && this.categoryId.length === 0) || (typeof this.categoryId === 'object' && !Array.isArray(this.categoryId) && Object.prototype.toString.call(this.categoryId) === '[object Object]' && Object.keys(Object(this.categoryId)).length === 0)))) {
      throw new Error('CAT_ITEM_001: categoryId requerido');
    }

    // Rule: item-requires-code
    // El ítem requiere itemCode.
    if (!(!(this.itemCode === undefined || this.itemCode === null || (typeof this.itemCode === 'string' && String(this.itemCode).trim() === '') || (Array.isArray(this.itemCode) && this.itemCode.length === 0) || (typeof this.itemCode === 'object' && !Array.isArray(this.itemCode) && Object.prototype.toString.call(this.itemCode) === '[object Object]' && Object.keys(Object(this.itemCode)).length === 0)))) {
      throw new Error('CAT_ITEM_002: itemCode requerido');
    }

    // Rule: item-requires-label
    // El ítem requiere label por defecto.
    if (!(!(this.label === undefined || this.label === null || (typeof this.label === 'string' && String(this.label).trim() === '') || (Array.isArray(this.label) && this.label.length === 0) || (typeof this.label === 'object' && !Array.isArray(this.label) && Object.prototype.toString.call(this.label) === '[object Object]' && Object.keys(Object(this.label)).length === 0)))) {
      throw new Error('CAT_ITEM_003: label requerido');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'catalogitem';
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
  static fromDto(dto: CreateCatalogItemDto): CatalogItem;
  static fromDto(dto: UpdateCatalogItemDto): CatalogItem;
  static fromDto(dto: DeleteCatalogItemDto): CatalogItem;
  static fromDto(dto: any): CatalogItem {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(CatalogItem, dto);
  }
}
