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

import { InputType, Field, ObjectType } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsObject,
  ValidateNested,
  IsArray,
} from "class-validator";

import { JsonObject } from "../../../core/types/graphql-types";

@InputType()
export class BaseCatalogDto {
  @ApiProperty({
    type: () => String,
    description: "Nombre de instancia CreateCatalog",
    example: "Nombre de instancia CreateCatalog",
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = "";

  // Propiedades predeterminadas de la clase CreateCatalogDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: "Fecha de creación de la instancia (CreateCatalog).",
    example: "Fecha de creación de la instancia (CreateCatalog).",
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: "Fecha de actualización de la instancia (CreateCatalog).",
    example: "Fecha de actualización de la instancia (CreateCatalog).",
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      "Usuario que realiza la creación de la instancia (CreateCatalog).",
    example: "Usuario que realiza la creación de la instancia (CreateCatalog).",
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: "Estado de activación de la instancia (CreateCatalog).",
    example: "Estado de activación de la instancia (CreateCatalog).",
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  // Constructor
  constructor(partial: Partial<BaseCatalogDto>) {
    Object.assign(this, partial);
  }
}

@InputType()
export class CatalogDto extends BaseCatalogDto {
  // Propiedades específicas de la clase CatalogDto en cuestión

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: "Identificador único de la instancia",
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: "Campo del nomenclador para describirlo",
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string;

  @ApiProperty({
    type: () => [String],
    nullable: true,
    default: [],
    description:
      "Listado de consumersKeys autorizados a acceder a los valores del nomenclador",
  })
  @IsString()
  @IsOptional()
  @Field(() => [String], { nullable: true, defaultValue: [] })
  consumersKeys?: string[];

  @ApiProperty({
    type: () => Boolean,
    nullable: true,
    default: [],
    description:
      "Determina si el nomenclador/catálogo tiene relación de recursividad de acuerdo a jerarquía",
  })
  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  recursive: boolean = false;

  @ApiProperty({
    type: () => [AttributeDto],
    nullable: true,
    default: [],
    description: "Listado de atributos del nomenclador",
  })
  @IsArray()
  @IsOptional()
  @Field(() => [AttributeDto], { nullable: true, defaultValue: [] })
  atributos?: AttributeDto[] = [];

  // Constructor
  constructor(partial: Partial<CatalogDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CatalogDto>): CatalogDto {
    const instance = new CatalogDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}

@InputType()
export class AttributeDto extends BaseCatalogDto {
  // Propiedades específicas de la clase CatalogDto en cuestión

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: "Identificador único de la instancia",
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: "Identificador único de la instancia padre",
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  parentId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: "Identificador del catálogo al que pertenece el atributo",
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  catalogId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: "Campo de la propiedad para describirla",
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: "Tipo de dato del atributo",
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  dataType: string = "String";

  @ApiProperty({
    type: () => Boolean,
    nullable: true,
    description: "Describe si el atributo puede ser null o no",
  })
  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  nulleable: boolean = false;

  @ApiProperty({
    type: () => [ValueDto],
    nullable: true,
    description: "Lista de valores declarados para el atributo",
  })
  @IsArray()
  @IsOptional()
  @Field(() => [ValueDto], { nullable: true, defaultValue: [] })
  values: ValueDto[] = [];

  // Constructor
  constructor(partial: Partial<AttributeDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<AttributeDto>): AttributeDto {
    const instance = new AttributeDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}

@InputType()
export class ValueDto extends BaseCatalogDto {
  // Propiedades específicas de la clase CatalogDto en cuestión

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: "Identificador único de la instancia",
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: "Identificador único de la instancia",
  })
  @IsObject()
  @IsOptional()
  @Field(() => JsonObject, { nullable: true })
  value: JsonObject = new JsonObject();

  @ApiProperty({
    type: () => AttributeDto,
    nullable: true,
    description: "Identificador único de la instancia",
  })
  @IsObject()
  @IsOptional()
  @Field(() => AttributeDto, { nullable: true })
  attribute?: AttributeDto;

  // Constructor
  constructor(partial: Partial<ValueDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ValueDto>): ValueDto {
    const instance = new ValueDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}

@InputType()
export class CatalogValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: "Campo de filtro",
  })
  @Field({ nullable: false })
  fieldName: string = "id";

  @ApiProperty({
    type: () => CatalogDto,
    nullable: false,
    description: "Valor del filtro",
  })
  @Field(() => CatalogDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
}

@InputType()
export class AttributeValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: "Campo de filtro",
  })
  @Field({ nullable: false })
  fieldName: string = "id";

  @ApiProperty({
    type: () => AttributeDto,
    nullable: false,
    description: "Valor del filtro",
  })
  @Field(() => AttributeDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
}

@InputType()
export class ValueValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: "Campo de filtro",
  })
  @Field({ nullable: false })
  fieldName: string = "id";

  @ApiProperty({
    type: () => ValueDto,
    nullable: false,
    description: "Valor del filtro",
  })
  @Field(() => ValueDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
}

@ObjectType()
export class CatalogOutPutDto extends BaseCatalogDto {
  // Propiedades específicas de la clase CatalogOutPutDto en cuestión

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: "Identificador único de la instancia",
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CatalogOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CatalogOutPutDto>): CatalogOutPutDto {
    const instance = new CatalogOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}

@ObjectType()
export class AttributeOutPutDto extends BaseCatalogDto {
  // Propiedades específicas de la clase AttributeOutPutDto en cuestión

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: "Identificador único de la instancia",
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<AttributeOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<AttributeOutPutDto>): AttributeOutPutDto {
    const instance = new AttributeOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}

@ObjectType()
export class ValueOutPutDto extends BaseCatalogDto {
  // Propiedades específicas de la clase ValueOutPutDto en cuestión

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: "Identificador único de la instancia",
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<ValueOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ValueOutPutDto>): ValueOutPutDto {
    const instance = new ValueOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}

@InputType()
export class CreateCatalogDto extends BaseCatalogDto {
  // Propiedades específicas de la clase CreateCatalogDto en cuestión

  @ApiProperty({
    type: () => String,
    description: "Identificador de instancia a crear",
    example:
      "Se proporciona un identificador de CreateCatalog a crear \(opcional\) ",
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateCatalogDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateCatalogDto>): CreateCatalogDto {
    const instance = new CreateCatalogDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}

@InputType()
export class CreateAttributeDto extends BaseCatalogDto {
  // Propiedades específicas de la clase CreateAttributeDto en cuestión

  @ApiProperty({
    type: () => String,
    description: "Identificador de instancia a crear",
    example:
      "Se proporciona un identificador de CreateAttribute a crear \(opcional\) ",
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateAttributeDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateAttributeDto>): CreateAttributeDto {
    const instance = new CreateAttributeDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}

@InputType()
export class CreateValueDto extends BaseCatalogDto {
  // Propiedades específicas de la clase CreateValueDto en cuestión

  @ApiProperty({
    type: () => String,
    description: "Identificador de instancia a crear",
    example:
      "Se proporciona un identificador de CreateValue a crear \(opcional\) ",
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateValueDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateValueDto>): CreateValueDto {
    const instance = new CreateValueDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}

@InputType()
export class CreateOrUpdateCatalogDto {
  @ApiProperty({
    type: () => String,
    description: "Identificador",
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  @ApiProperty({
    type: () => CreateCatalogDto,
    description: "Instancia CreateCatalog o UpdateCatalog",
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateCatalogDto, { nullable: true })
  input?: CreateCatalogDto | UpdateCatalogDto; // Asegúrate de que esto esté correcto
}

@InputType()
export class CreateOrUpdateAttributeDto {
  @ApiProperty({
    type: () => String,
    description: "Identificador",
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  @ApiProperty({
    type: () => CreateAttributeDto,
    description: "Instancia CreateAttribute o UpdateAttribute",
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateAttributeDto, { nullable: true })
  input?: CreateAttributeDto | UpdateAttributeDto; // Asegúrate de que esto esté correcto
}

@InputType()
export class CreateOrUpdateValueDto {
  @ApiProperty({
    type: () => String,
    description: "Identificador",
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  @ApiProperty({
    type: () => CreateValueDto,
    description: "Instancia CreateValue o UpdateValue",
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateValueDto, { nullable: true })
  input?: CreateValueDto | UpdateValueDto; // Asegúrate de que esto esté correcto
}

@InputType()
export class DeleteCatalogDto {
  // Propiedades específicas de la clase DeleteCatalogDto en cuestión

  @ApiProperty({
    type: () => String,
    description: "Identificador de instancia a eliminar",
    example: "Se proporciona un identificador de DeleteCatalog a eliminar",
    default: "",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id: string = "";

  @ApiProperty({
    type: () => String,
    description: "Lista de identificadores de instancias a eliminar",
    example:
      "Se proporciona una lista de identificadores de DeleteCatalog a eliminar",
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}

@InputType()
export class DeleteAttributeDto {
  // Propiedades específicas de la clase DeleteAttributeDto en cuestión

  @ApiProperty({
    type: () => String,
    description: "Identificador de instancia a eliminar",
    example: "Se proporciona un identificador de DeleteAttribute a eliminar",
    default: "",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id: string = "";

  @ApiProperty({
    type: () => String,
    description: "Lista de identificadores de instancias a eliminar",
    example:
      "Se proporciona una lista de identificadores de DeleteAttribute a eliminar",
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}

@InputType()
export class DeleteValueDto {
  // Propiedades específicas de la clase DeleteValueDto en cuestión

  @ApiProperty({
    type: () => String,
    description: "Identificador de instancia a eliminar",
    example: "Se proporciona un identificador de DeleteValue a eliminar",
    default: "",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id: string = "";

  @ApiProperty({
    type: () => String,
    description: "Lista de identificadores de instancias a eliminar",
    example:
      "Se proporciona una lista de identificadores de DeleteValue a eliminar",
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}

@InputType()
export class UpdateCatalogDto extends BaseCatalogDto {
  // Propiedades específicas de la clase UpdateCatalogDto en cuestión

  @ApiProperty({
    type: () => String,
    description: "Identificador de instancia a actualizar",
    example: "Se proporciona un identificador de UpdateCatalog a actualizar",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateCatalogDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateCatalogDto>): UpdateCatalogDto {
    const instance = new UpdateCatalogDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}

@InputType()
export class UpdateAttributeDto extends BaseCatalogDto {
  // Propiedades específicas de la clase UpdateAttributeDto en cuestión

  @ApiProperty({
    type: () => String,
    description: "Identificador de instancia a actualizar",
    example: "Se proporciona un identificador de UpdateAttribute a actualizar",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateAttributeDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateAttributeDto>): UpdateAttributeDto {
    const instance = new UpdateAttributeDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}

@InputType()
export class UpdateValueDto extends BaseCatalogDto {
  // Propiedades específicas de la clase UpdateValueDto en cuestión

  @ApiProperty({
    type: () => String,
    description: "Identificador de instancia a actualizar",
    example: "Se proporciona un identificador de UpdateValue a actualizar",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateValueDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateValueDto>): UpdateValueDto {
    const instance = new UpdateValueDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}
