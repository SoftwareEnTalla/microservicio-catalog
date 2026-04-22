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
export class BaseCatalogCategoryDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateCatalogCategory',
    example: 'Nombre de instancia CreateCatalogCategory',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateCatalogCategoryDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateCatalogCategory).',
    example: 'Fecha de creación de la instancia (CreateCatalogCategory).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateCatalogCategory).',
    example: 'Fecha de actualización de la instancia (CreateCatalogCategory).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateCatalogCategory).',
    example:
      'Usuario que realiza la creación de la instancia (CreateCatalogCategory).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateCatalogCategory).',
    example: 'Estado de activación de la instancia (CreateCatalogCategory).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código único uppercase (ej. CURRENCY)',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código único uppercase (ej. CURRENCY)', nullable: false })
  categoryCode!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Microservicio dueño lógico',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Microservicio dueño lógico', nullable: false })
  ownerService!: string;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Lista de ms que consumen esta categoría',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Lista de ms que consumen esta categoría', nullable: true })
  consumers?: Record<string, any> = {};

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado de la categoría',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado de la categoría', nullable: false })
  status!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Versión semver',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Versión semver', nullable: false })
  version!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Hash SHA-256 del contenido de items (para cache)',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Hash SHA-256 del contenido de items (para cache)', nullable: true })
  hash?: string = '';

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Cantidad actual de ítems activos',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Cantidad actual de ítems activos', nullable: false })
  itemsCount!: number;

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
    type: () => Object,
    nullable: true,
    description: 'Metadatos libres',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos libres', nullable: true })
  metadata?: Record<string, any> = {};

  // Constructor
  constructor(partial: Partial<BaseCatalogCategoryDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class CatalogCategoryDto extends BaseCatalogCategoryDto {
  // Propiedades específicas de la clase CatalogCategoryDto en cuestión

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
  constructor(partial: Partial<CatalogCategoryDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CatalogCategoryDto>): CatalogCategoryDto {
    const instance = new CatalogCategoryDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class CatalogCategoryValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => CatalogCategoryDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => CatalogCategoryDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class CatalogCategoryOutPutDto extends BaseCatalogCategoryDto {
  // Propiedades específicas de la clase CatalogCategoryOutPutDto en cuestión

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
  constructor(partial: Partial<CatalogCategoryOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CatalogCategoryOutPutDto>): CatalogCategoryOutPutDto {
    const instance = new CatalogCategoryOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateCatalogCategoryDto extends BaseCatalogCategoryDto {
  // Propiedades específicas de la clase CreateCatalogCategoryDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateCatalogCategory a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateCatalogCategoryDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateCatalogCategoryDto>): CreateCatalogCategoryDto {
    const instance = new CreateCatalogCategoryDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateCatalogCategoryDto {
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
    type: () => CreateCatalogCategoryDto,
    description: 'Instancia CreateCatalogCategory o UpdateCatalogCategory',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateCatalogCategoryDto, { nullable: true })
  input?: CreateCatalogCategoryDto | UpdateCatalogCategoryDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteCatalogCategoryDto {
  // Propiedades específicas de la clase DeleteCatalogCategoryDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteCatalogCategory a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteCatalogCategory a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateCatalogCategoryDto extends BaseCatalogCategoryDto {
  // Propiedades específicas de la clase UpdateCatalogCategoryDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateCatalogCategory a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateCatalogCategoryDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateCatalogCategoryDto>): UpdateCatalogCategoryDto {
    const instance = new UpdateCatalogCategoryDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



