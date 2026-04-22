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
export class BaseCatalogItemHistoryDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateCatalogItemHistory',
    example: 'Nombre de instancia CreateCatalogItemHistory',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateCatalogItemHistoryDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateCatalogItemHistory).',
    example: 'Fecha de creación de la instancia (CreateCatalogItemHistory).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateCatalogItemHistory).',
    example: 'Fecha de actualización de la instancia (CreateCatalogItemHistory).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateCatalogItemHistory).',
    example:
      'Usuario que realiza la creación de la instancia (CreateCatalogItemHistory).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateCatalogItemHistory).',
    example: 'Estado de activación de la instancia (CreateCatalogItemHistory).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Ítem versionado',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Ítem versionado', nullable: false })
  catalogItemId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Categoría',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Categoría', nullable: false })
  categoryCode!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código del ítem',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código del ítem', nullable: false })
  itemCode!: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Versión capturada',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Versión capturada', nullable: false })
  version!: number;

  @ApiProperty({
    type: () => Object,
    nullable: false,
    description: 'Snapshot completo del ítem',
  })
  @IsObject()
  @IsNotEmpty()
  @Field(() => GraphQLJSON, { description: 'Snapshot completo del ítem', nullable: false })
  snapshot!: Record<string, any>;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Usuario que realizó el cambio',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Usuario que realizó el cambio', nullable: false })
  changedBy!: string;

  @ApiProperty({
    type: () => Date,
    nullable: false,
    description: 'Momento del cambio',
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { description: 'Momento del cambio', nullable: false })
  changedAt!: Date;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Diff respecto de la versión anterior',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Diff respecto de la versión anterior', nullable: true })
  diff?: Record<string, any> = {};

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Motivo del cambio',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Motivo del cambio', nullable: true })
  reason?: string = '';

  // Constructor
  constructor(partial: Partial<BaseCatalogItemHistoryDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class CatalogItemHistoryDto extends BaseCatalogItemHistoryDto {
  // Propiedades específicas de la clase CatalogItemHistoryDto en cuestión

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
  constructor(partial: Partial<CatalogItemHistoryDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CatalogItemHistoryDto>): CatalogItemHistoryDto {
    const instance = new CatalogItemHistoryDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class CatalogItemHistoryValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => CatalogItemHistoryDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => CatalogItemHistoryDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class CatalogItemHistoryOutPutDto extends BaseCatalogItemHistoryDto {
  // Propiedades específicas de la clase CatalogItemHistoryOutPutDto en cuestión

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
  constructor(partial: Partial<CatalogItemHistoryOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CatalogItemHistoryOutPutDto>): CatalogItemHistoryOutPutDto {
    const instance = new CatalogItemHistoryOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateCatalogItemHistoryDto extends BaseCatalogItemHistoryDto {
  // Propiedades específicas de la clase CreateCatalogItemHistoryDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateCatalogItemHistory a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateCatalogItemHistoryDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateCatalogItemHistoryDto>): CreateCatalogItemHistoryDto {
    const instance = new CreateCatalogItemHistoryDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateCatalogItemHistoryDto {
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
    type: () => CreateCatalogItemHistoryDto,
    description: 'Instancia CreateCatalogItemHistory o UpdateCatalogItemHistory',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateCatalogItemHistoryDto, { nullable: true })
  input?: CreateCatalogItemHistoryDto | UpdateCatalogItemHistoryDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteCatalogItemHistoryDto {
  // Propiedades específicas de la clase DeleteCatalogItemHistoryDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteCatalogItemHistory a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteCatalogItemHistory a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateCatalogItemHistoryDto extends BaseCatalogItemHistoryDto {
  // Propiedades específicas de la clase UpdateCatalogItemHistoryDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateCatalogItemHistory a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateCatalogItemHistoryDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateCatalogItemHistoryDto>): UpdateCatalogItemHistoryDto {
    const instance = new UpdateCatalogItemHistoryDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



