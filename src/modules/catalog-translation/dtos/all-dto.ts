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

import { InputType, Field, Float, Int, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsObject,
  IsUUID,
  ValidateNested,
} from 'class-validator';




@InputType()
export class BaseCatalogTranslationDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateCatalogTranslation',
    example: 'Nombre de instancia CreateCatalogTranslation',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateCatalogTranslationDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateCatalogTranslation).',
    example: 'Fecha de creación de la instancia (CreateCatalogTranslation).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateCatalogTranslation).',
    example: 'Fecha de actualización de la instancia (CreateCatalogTranslation).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateCatalogTranslation).',
    example:
      'Usuario que realiza la creación de la instancia (CreateCatalogTranslation).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateCatalogTranslation).',
    example: 'Estado de activación de la instancia (CreateCatalogTranslation).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Ítem traducido',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Ítem traducido', nullable: false })
  catalogItemId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Categoría (denormalizada)',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Categoría (denormalizada)', nullable: false })
  categoryCode!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Ítem (denormalizado)',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Ítem (denormalizado)', nullable: false })
  itemCode!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Locale BCP47 (es, en, pt-BR)',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Locale BCP47 (es, en, pt-BR)', nullable: false })
  locale!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Etiqueta localizada',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Etiqueta localizada', nullable: false })
  label!: string;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos (género gramatical, plural...)',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos (género gramatical, plural...)', nullable: true })
  metadata?: Record<string, any> = {};

  // Constructor
  constructor(partial: Partial<BaseCatalogTranslationDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class CatalogTranslationDto extends BaseCatalogTranslationDto {
  // Propiedades específicas de la clase CatalogTranslationDto en cuestión

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador único de la instancia',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CatalogTranslationDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CatalogTranslationDto>): CatalogTranslationDto {
    const instance = new CatalogTranslationDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class CatalogTranslationValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => CatalogTranslationDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => CatalogTranslationDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class CatalogTranslationOutPutDto extends BaseCatalogTranslationDto {
  // Propiedades específicas de la clase CatalogTranslationOutPutDto en cuestión

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador único de la instancia',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CatalogTranslationOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CatalogTranslationOutPutDto>): CatalogTranslationOutPutDto {
    const instance = new CatalogTranslationOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateCatalogTranslationDto extends BaseCatalogTranslationDto {
  // Propiedades específicas de la clase CreateCatalogTranslationDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateCatalogTranslation a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateCatalogTranslationDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateCatalogTranslationDto>): CreateCatalogTranslationDto {
    const instance = new CreateCatalogTranslationDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateCatalogTranslationDto {
  @ApiProperty({
    type: () => String,
    description: 'Identificador',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  @ApiProperty({
    type: () => CreateCatalogTranslationDto,
    description: 'Instancia CreateCatalogTranslation o UpdateCatalogTranslation',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateCatalogTranslationDto, { nullable: true })
  input?: CreateCatalogTranslationDto | UpdateCatalogTranslationDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteCatalogTranslationDto {
  // Propiedades específicas de la clase DeleteCatalogTranslationDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteCatalogTranslation a eliminar',
    default: '',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id: string = '';

  @ApiProperty({
    type: () => String,
    description: 'Lista de identificadores de instancias a eliminar',
    example:
      'Se proporciona una lista de identificadores de DeleteCatalogTranslation a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateCatalogTranslationDto extends BaseCatalogTranslationDto {
  // Propiedades específicas de la clase UpdateCatalogTranslationDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateCatalogTranslation a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateCatalogTranslationDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateCatalogTranslationDto>): UpdateCatalogTranslationDto {
    const instance = new UpdateCatalogTranslationDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



