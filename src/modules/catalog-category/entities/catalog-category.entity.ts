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
import { CreateCatalogCategoryDto, UpdateCatalogCategoryDto, DeleteCatalogCategoryDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';


@Index('idx_catalog_category_code', ['categoryCode'], { unique: true })
@Index('idx_catalog_category_status', ['status'])
@Unique('uq_catalog_category_code', ['categoryCode'])
@ChildEntity('catalogcategory')
@ObjectType()
export class CatalogCategory extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de CatalogCategory",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de CatalogCategory", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia CatalogCategory' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de CatalogCategory",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de CatalogCategory", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia CatalogCategory' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código único uppercase (ej. CURRENCY)',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código único uppercase (ej. CURRENCY)', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 80, unique: true, comment: 'Código único uppercase (ej. CURRENCY)' })
  categoryCode!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Microservicio dueño lógico',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Microservicio dueño lógico', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 60, comment: 'Microservicio dueño lógico' })
  ownerService!: string;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Lista de ms que consumen esta categoría',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Lista de ms que consumen esta categoría', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Lista de ms que consumen esta categoría' })
  consumers?: Record<string, any> = {};

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado de la categoría',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado de la categoría', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'ACTIVE', comment: 'Estado de la categoría' })
  status!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Versión semver',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Versión semver', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 20, default: '1.0.0', comment: 'Versión semver' })
  version!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Hash SHA-256 del contenido de items (para cache)',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Hash SHA-256 del contenido de items (para cache)', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 80, comment: 'Hash SHA-256 del contenido de items (para cache)' })
  hash?: string = '';

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Cantidad actual de ítems activos',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Cantidad actual de ítems activos', nullable: false })
  @Column({ type: 'int', nullable: false, default: 0, comment: 'Cantidad actual de ítems activos' })
  itemsCount!: number;

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
    type: () => Object,
    nullable: true,
    description: 'Metadatos libres',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos libres', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Metadatos libres' })
  metadata?: Record<string, any> = {};

  protected executeDslLifecycle(): void {
    // Rule: category-requires-code
    // La categoría requiere categoryCode.
    if (!(!(this.categoryCode === undefined || this.categoryCode === null || (typeof this.categoryCode === 'string' && String(this.categoryCode).trim() === '') || (Array.isArray(this.categoryCode) && this.categoryCode.length === 0) || (typeof this.categoryCode === 'object' && !Array.isArray(this.categoryCode) && Object.prototype.toString.call(this.categoryCode) === '[object Object]' && Object.keys(Object(this.categoryCode)).length === 0)))) {
      throw new Error('CAT_CAT_001: categoryCode requerido');
    }

    // Rule: category-requires-name
    // La categoría requiere name.
    if (!(!(this.name === undefined || this.name === null || (typeof this.name === 'string' && String(this.name).trim() === '') || (Array.isArray(this.name) && this.name.length === 0) || (typeof this.name === 'object' && !Array.isArray(this.name) && Object.prototype.toString.call(this.name) === '[object Object]' && Object.keys(Object(this.name)).length === 0)))) {
      throw new Error('CAT_CAT_002: name requerido');
    }

    // Rule: category-requires-owner
    // La categoría requiere ownerService.
    if (!(!(this.ownerService === undefined || this.ownerService === null || (typeof this.ownerService === 'string' && String(this.ownerService).trim() === '') || (Array.isArray(this.ownerService) && this.ownerService.length === 0) || (typeof this.ownerService === 'object' && !Array.isArray(this.ownerService) && Object.prototype.toString.call(this.ownerService) === '[object Object]' && Object.keys(Object(this.ownerService)).length === 0)))) {
      throw new Error('CAT_CAT_003: ownerService requerido');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'catalogcategory';
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
  static fromDto(dto: CreateCatalogCategoryDto): CatalogCategory;
  static fromDto(dto: UpdateCatalogCategoryDto): CatalogCategory;
  static fromDto(dto: DeleteCatalogCategoryDto): CatalogCategory;
  static fromDto(dto: any): CatalogCategory {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(CatalogCategory, dto);
  }
}
