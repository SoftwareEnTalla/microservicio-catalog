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
export class BaseCatalogItemDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateCatalogItem',
    example: 'Nombre de instancia CreateCatalogItem',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateCatalogItemDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateCatalogItem).',
    example: 'Fecha de creación de la instancia (CreateCatalogItem).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateCatalogItem).',
    example: 'Fecha de actualización de la instancia (CreateCatalogItem).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateCatalogItem).',
    example:
      'Usuario que realiza la creación de la instancia (CreateCatalogItem).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateCatalogItem).',
    example: 'Estado de activación de la instancia (CreateCatalogItem).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Categoría a la que pertenece',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Categoría a la que pertenece', nullable: false })
  categoryId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código de la categoría (denormalizado)',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código de la categoría (denormalizado)', nullable: false })
  categoryCode!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código único por categoría (ej. MXN)',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código único por categoría (ej. MXN)', nullable: false })
  itemCode!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Etiqueta por defecto (locale en)',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Etiqueta por defecto (locale en)', nullable: false })
  label!: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Orden de presentación',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Orden de presentación', nullable: false })
  sortOrder!: number;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Ítem por defecto de la categoría',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Ítem por defecto de la categoría', nullable: false })
  isDefault!: boolean;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado del ítem',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado del ítem', nullable: false })
  status!: string;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Vigente desde',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Vigente desde', nullable: true })
  validFrom?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Vigente hasta',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Vigente hasta', nullable: true })
  validTo?: Date = new Date();

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Versión incremental del ítem',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Versión incremental del ítem', nullable: false })
  version!: number;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos libres (símbolo de moneda, alpha3, etc.)',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos libres (símbolo de moneda, alpha3, etc.)', nullable: true })
  metadata?: Record<string, any> = {};

  // Constructor
  constructor(partial: Partial<BaseCatalogItemDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class CatalogItemDto extends BaseCatalogItemDto {
  // Propiedades específicas de la clase CatalogItemDto en cuestión

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
  constructor(partial: Partial<CatalogItemDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CatalogItemDto>): CatalogItemDto {
    const instance = new CatalogItemDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class CatalogItemValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => CatalogItemDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => CatalogItemDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class CatalogItemOutPutDto extends BaseCatalogItemDto {
  // Propiedades específicas de la clase CatalogItemOutPutDto en cuestión

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
  constructor(partial: Partial<CatalogItemOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CatalogItemOutPutDto>): CatalogItemOutPutDto {
    const instance = new CatalogItemOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateCatalogItemDto extends BaseCatalogItemDto {
  // Propiedades específicas de la clase CreateCatalogItemDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateCatalogItem a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateCatalogItemDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateCatalogItemDto>): CreateCatalogItemDto {
    const instance = new CreateCatalogItemDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateCatalogItemDto {
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
    type: () => CreateCatalogItemDto,
    description: 'Instancia CreateCatalogItem o UpdateCatalogItem',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateCatalogItemDto, { nullable: true })
  input?: CreateCatalogItemDto | UpdateCatalogItemDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteCatalogItemDto {
  // Propiedades específicas de la clase DeleteCatalogItemDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteCatalogItem a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteCatalogItem a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateCatalogItemDto extends BaseCatalogItemDto {
  // Propiedades específicas de la clase UpdateCatalogItemDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateCatalogItem a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateCatalogItemDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateCatalogItemDto>): UpdateCatalogItemDto {
    const instance = new UpdateCatalogItemDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



