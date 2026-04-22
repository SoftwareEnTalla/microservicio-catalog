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
import { CreateCatalogTranslationDto, UpdateCatalogTranslationDto, DeleteCatalogTranslationDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';


@Index('idx_catalog_translation_item_locale', ['catalogItemId', 'locale'], { unique: true })
@Unique('uq_catalog_translation_item_locale', ['catalogItemId', 'locale'])
@ChildEntity('catalogtranslation')
@ObjectType()
export class CatalogTranslation extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de CatalogTranslation",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de CatalogTranslation", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia CatalogTranslation' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de CatalogTranslation",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de CatalogTranslation", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia CatalogTranslation' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Ítem traducido',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Ítem traducido', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Ítem traducido' })
  catalogItemId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Categoría (denormalizada)',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Categoría (denormalizada)', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 80, comment: 'Categoría (denormalizada)' })
  categoryCode!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Ítem (denormalizado)',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Ítem (denormalizado)', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 80, comment: 'Ítem (denormalizado)' })
  itemCode!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Locale BCP47 (es, en, pt-BR)',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Locale BCP47 (es, en, pt-BR)', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 16, comment: 'Locale BCP47 (es, en, pt-BR)' })
  locale!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Etiqueta localizada',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Etiqueta localizada', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 200, comment: 'Etiqueta localizada' })
  label!: string;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos (género gramatical, plural...)',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos (género gramatical, plural...)', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Metadatos (género gramatical, plural...)' })
  metadata?: Record<string, any> = {};

  protected executeDslLifecycle(): void {
    // Rule: translation-requires-item
    // La traducción requiere catalogItemId.
    if (!(!(this.catalogItemId === undefined || this.catalogItemId === null || (typeof this.catalogItemId === 'string' && String(this.catalogItemId).trim() === '') || (Array.isArray(this.catalogItemId) && this.catalogItemId.length === 0) || (typeof this.catalogItemId === 'object' && !Array.isArray(this.catalogItemId) && Object.prototype.toString.call(this.catalogItemId) === '[object Object]' && Object.keys(Object(this.catalogItemId)).length === 0)))) {
      throw new Error('CAT_TR_001: catalogItemId requerido');
    }

    // Rule: translation-requires-locale
    // La traducción requiere locale.
    if (!(!(this.locale === undefined || this.locale === null || (typeof this.locale === 'string' && String(this.locale).trim() === '') || (Array.isArray(this.locale) && this.locale.length === 0) || (typeof this.locale === 'object' && !Array.isArray(this.locale) && Object.prototype.toString.call(this.locale) === '[object Object]' && Object.keys(Object(this.locale)).length === 0)))) {
      throw new Error('CAT_TR_002: locale requerido');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'catalogtranslation';
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
  static fromDto(dto: CreateCatalogTranslationDto): CatalogTranslation;
  static fromDto(dto: UpdateCatalogTranslationDto): CatalogTranslation;
  static fromDto(dto: DeleteCatalogTranslationDto): CatalogTranslation;
  static fromDto(dto: any): CatalogTranslation {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(CatalogTranslation, dto);
  }
}
