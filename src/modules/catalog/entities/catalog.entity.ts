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

import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "./base.entity";
import {
  CreateCatalogDto,
  UpdateCatalogDto,
  DeleteCatalogDto,
  CreateAttributeDto,
  UpdateAttributeDto,
  DeleteAttributeDto,
  ValueDto,
  AttributeDto,
  CreateValueDto,
  UpdateValueDto,
  DeleteValueDto,
} from "../dtos/all-dto";

import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  validate,
} from "class-validator";
import { plainToClass, plainToInstance } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { Field, ObjectType } from "@nestjs/graphql";
import { ValueContent } from "@core/types/graphql-types";

@ObjectType()
@Entity("attribute")
export class Attribute extends BaseEntity {
  // Propiedades de Attribute
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de Attribute",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, {
    description: "Nombre de la instancia de Attribute",
    nullable: false,
  })
  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
    comment: "Este es un campo para nombrar la instancia Attribute",
  })
  private name!: string;

  @ApiProperty({
    type: String,
    nullable: false,
    description: "Descripción de la instancia de Attribute",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, {
    description: "Descripción de la instancia de Attribute",
    nullable: false,
  })
  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
    default: "Sin descripción",
    comment: "Este es un campo para describir la instancia Attribute",
  })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: "Identificador único de la instancia padre",
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  @Column({
    type: "varchar",
    length: 64,
    nullable: false,
    comment: "Este es un campo para referenciar a la instancia padre",
  })
  parentId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: "Identificador del catálogo al que pertenece el atributo",
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  @Column({
    type: "varchar",
    length: 64,
    nullable: false,
    comment:
      "Este es un campo para referenciar al nomenclador al que pertenece el atributo",
  })
  catalogId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: "Tipo de dato del atributo",
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  @Column({
    type: "varchar",
    length: 20,
    nullable: false,
    comment: "Este es un campo para denotar el tipo de datos del Attributo",
  })
  dataType: string = "String";

  @ApiProperty({
    type: () => Boolean,
    nullable: true,
    description: "Describe si el atributo puede ser null o no",
  })
  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @Column({
    type: "boolean",
    default: false,
    comment: "Este es un campo para denotar si el atributo puede ser null o no",
  })
  nulleable: boolean = false;

  @ApiProperty({
    type: () => [Value],
    nullable: true,
    description: "Lista de valores declarados para el atributo",
  })
  @IsArray()
  @IsOptional()
  @Field(() => [Value], { nullable: true, defaultValue: [] })
  @Column({
    type: "jsonb",
    default: [],
    comment: "Este es un campo para denotar los valores del atributo",
  })
  @OneToMany(() => Value, (value) => value.attribute, { cascade: true })
  values?: Value[];

  // Constructor de Attribute
  constructor() {
    super();
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

  set setDescription(value: string) {
    this.description = value;
  }

  //Métodos o funciones de Attribute

  static fromDto(
    dto: CreateAttributeDto | UpdateAttributeDto | DeleteAttributeDto
  ): Attribute {
    return plainToClass(Attribute, dto);
  }

  //Implementación de Métodos abstractos de la clase padre
  async create(data: any): Promise<Attribute> {
    // Verifica si data es un array y toma el primer objeto si es necesario
    const singleData = Array.isArray(data) ? data[0] : data; // Si es un array, tomamos el primer objeto

    // Convertir el objeto data a una instancia del DTO
    const attributeDto = plainToInstance(
      CreateAttributeDto,
      data as CreateAttributeDto
    );

    // Validar el DTO
    const errors = await validate(attributeDto);
    if (errors.length > 0) {
      throw new Error("Validation failed creating attribute!"); // Manejo de errores de validación
    }
    // Asignar la fecha de modificación
    attributeDto.modificationDate = new Date();
    return { ...this, ...attributeDto };
  }
  async update(data: any): Promise<Attribute> {
    // Verifica si data es un array y toma el primer objeto si es necesario
    const singleData = Array.isArray(data) ? data[0] : data; // Si es un array, tomamos el primer objeto

    // Convertir el objeto data a una instancia del DTO
    const attributeDto = plainToInstance(
      CreateAttributeDto,
      singleData as CreateAttributeDto
    );

    // Validar el DTO
    const errors = await validate(attributeDto);
    if (errors.length > 0) {
      throw new Error("Validation failed creating catalog!"); // Manejo de errores de validación
    }
    // Asignar la fecha de modificación
    attributeDto.modificationDate = new Date();
    return { ...this, ...attributeDto };
  }
  async delete(): Promise<Attribute> {
    return { ...this };
  }
}
@ObjectType()
@Entity("value")
export class Value extends BaseEntity {
  // Propiedades de Value
  @ApiProperty({
    type: () => ValueContent,
    nullable: true,
    description: "Valor de la propiedad",
  })
  @IsObject()
  @IsNotEmptyObject()
  @Field(() => ValueContent, { nullable: true })
  @Column({
    type: "json",
    nullable: false,
    comment: "Este es un campo para declarar el valor de la propiedad",
  })
  value: ValueContent = new ValueContent();

  @ManyToOne(() => Attribute, (attribute) => attribute.values)
  attribute?: Attribute; // Relación con Atributo

  // Constructor de Value
  constructor() {
    super();
  }

  // Getters y Setters

  get getValue(): Object {
    return this.value;
  }

  set setName(value: Object) {
    this.value = value;
  }

  //Métodos o funciones de Value

  static fromDto(dto: CreateValueDto | UpdateValueDto | DeleteValueDto): Value {
    return plainToClass(Value, dto);
  }

  //Implementación de Métodos abstractos de la clase padre
  async create(data: any): Promise<Value> {
    // Verifica si data es un array y toma el primer objeto si es necesario
    const singleData = Array.isArray(data) ? data[0] : data; // Si es un array, tomamos el primer objeto

    // Convertir el objeto data a una instancia del DTO
    const attributeDto = plainToInstance(
      CreateValueDto,
      data as CreateValueDto
    );

    // Validar el DTO
    const errors = await validate(attributeDto);
    if (errors.length > 0) {
      throw new Error("Validation failed creating attribute!"); // Manejo de errores de validación
    }
    // Asignar la fecha de modificación
    attributeDto.modificationDate = new Date();
    return { ...this, ...attributeDto };
  }
  async update(data: any): Promise<Value> {
    // Verifica si data es un array y toma el primer objeto si es necesario
    const singleData = Array.isArray(data) ? data[0] : data; // Si es un array, tomamos el primer objeto

    // Convertir el objeto data a una instancia del DTO
    const attributeDto = plainToInstance(
      CreateValueDto,
      singleData as CreateValueDto
    );

    // Validar el DTO
    const errors = await validate(attributeDto);
    if (errors.length > 0) {
      throw new Error("Validation failed creating catalog!"); // Manejo de errores de validación
    }
    // Asignar la fecha de modificación
    attributeDto.modificationDate = new Date();
    return { ...this, ...attributeDto };
  }
  async delete(): Promise<Value> {
    return { ...this };
  }
}

@ObjectType()
@Entity("catalog")
export class Catalog extends BaseEntity {
  // Propiedades de Catalog
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de Catalog",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, {
    description: "Nombre de la instancia de Catalog",
    nullable: false,
  })
  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
    comment: "Este es un campo para nombrar la instancia Catalog",
  })
  private name!: string;

  @ApiProperty({
    type: String,
    nullable: false,
    description: "Descripción de la instancia de Catalog",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, {
    description: "Descripción de la instancia de Catalog",
    nullable: false,
  })
  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
    default: "Sin descripción",
    comment: "Este es un campo para describir la instancia Catalog",
  })
  private description!: string;

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
    type: () => [Attribute],
    nullable: true,
    default: [],
    description: "Listado de atributos del nomenclador",
  })
  @IsArray()
  @IsOptional()
  @Field(() => [Attribute], { nullable: true, defaultValue: [] })
  atributos?: Attribute[] = [];

  // Constructor de Catalog
  constructor() {
    super();
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

  set setDescription(value: string) {
    this.description = value;
  }

  //Métodos o funciones de Catalog

  static fromDto(
    dto: CreateCatalogDto | UpdateCatalogDto | DeleteCatalogDto
  ): Catalog {
    return plainToClass(Catalog, dto);
  }

  //Implementación de Métodos abstractos de la clase padre
  async create(data: any): Promise<Catalog> {
    // Verifica si data es un array y toma el primer objeto si es necesario
    const singleData = Array.isArray(data) ? data[0] : data; // Si es un array, tomamos el primer objeto

    // Convertir el objeto data a una instancia del DTO
    const catalogDto = plainToInstance(
      CreateCatalogDto,
      data as CreateCatalogDto
    );

    // Validar el DTO
    const errors = await validate(catalogDto);
    if (errors.length > 0) {
      throw new Error("Validation failed creating catalog!"); // Manejo de errores de validación
    }
    // Asignar la fecha de modificación
    catalogDto.modificationDate = new Date();
    return { ...this, ...catalogDto };
  }
  async update(data: any): Promise<Catalog> {
    // Verifica si data es un array y toma el primer objeto si es necesario
    const singleData = Array.isArray(data) ? data[0] : data; // Si es un array, tomamos el primer objeto

    // Convertir el objeto data a una instancia del DTO
    const catalogDto = plainToInstance(
      CreateCatalogDto,
      singleData as CreateCatalogDto
    );

    // Validar el DTO
    const errors = await validate(catalogDto);
    if (errors.length > 0) {
      throw new Error("Validation failed creating catalog!"); // Manejo de errores de validación
    }
    // Asignar la fecha de modificación
    catalogDto.modificationDate = new Date();
    return { ...this, ...catalogDto };
  }
  async delete(): Promise<Catalog> {
    return { ...this };
  }
}
