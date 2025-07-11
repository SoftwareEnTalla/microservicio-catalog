import { Field, Float, InputType, Int, ObjectType } from "@nestjs/graphql";
import { ApiProperty, ApiPropertyOptions } from "@nestjs/swagger";
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsDateString,
  IsEnum,
  IsInt,
  IsJSON,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from "class-validator";

@InputType()
class PointInput {
  @Field(() => Float)
  x?: number;

  @Field(() => Float)
  y?: number;
}

@InputType()
class PolygonInput {
  @Field(() => [[[Float]]])
  coordinates?: number[][][];
}

@InputType()
class IntRangeInput {
  @Field(() => Int)
  from?: number;

  @Field(() => Int)
  to?: number;
}

@InputType()
class DateRangeInput {
  @Field(() => String)
  from?: string;

  @Field(() => String)
  to?: string;
}

@InputType()
export class ValueContentInput {
  @Field(() => String, { nullable: true })
  stringValue?: string;

  @Field(() => Float, { nullable: true })
  floatValue?: number;

  @Field(() => Int, { nullable: true })
  intValue?: number;

  @Field(() => Boolean, { nullable: true })
  booleanValue?: boolean;

  @Field(() => Date, { nullable: true })
  dateValue?: Date;

  @Field(() => String, { nullable: true })
  dateTimeString?: string;

  @Field(() => JsonObject, { nullable: true })
  jsonObject?: any;

  @Field(() => PointInput, { nullable: true })
  pointValue?: PointInput;

  @Field(() => PolygonInput, { nullable: true })
  polygonValue?: PolygonInput;

  @Field(() => [String], { nullable: true })
  stringArray?: string[];

  @Field(() => [Float], { nullable: true })
  numberArray?: number[];

  @Field(() => String, { nullable: true })
  statusEnum?: string;

  @Field(() => String, { nullable: true })
  relationId?: string;

  @Field(() => JsonObject, { nullable: true })
  embeddedRelation?: any;

  @Field(() => String, { nullable: true })
  uuidValue?: string;

  @Field(() => String, { nullable: true })
  xmlValue?: string;

  @Field(() => IntRangeInput, { nullable: true })
  intRange?: IntRangeInput;

  @Field(() => DateRangeInput, { nullable: true })
  dateRange?: DateRangeInput;
}

@ObjectType()
@InputType("JsonObjectInput")
@ObjectType("JsonObjectOutPut")
export class JsonObject {
  @Field(() => String, { nullable: true })
  key?: string;

  @Field(() => String, { nullable: true })
  value?: string;

  // Agrega más campos según sea necesario
}

@ObjectType()
export class ValueContent {
  // Tipos básicos
  @ApiProperty({ type: String, nullable: true })
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  stringValue?: string;

  @ApiProperty({ type: Number, format: "float", nullable: true })
  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  floatValue?: number;

  @ApiProperty({ type: Number, format: "int32", nullable: true })
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  intValue?: number;

  @ApiProperty({ type: Boolean, nullable: true })
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  booleanValue?: boolean;

  // Tipos de fecha/hora
  @ApiProperty({ type: Date, nullable: true })
  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  dateValue?: Date;

  @ApiProperty({ type: String, format: "date-time", nullable: true })
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsDateString()
  dateTimeString?: string;

  // Tipos JSON/Objeto - SOLUCIÓN PARA LOS ERRORES
  @ApiProperty({
    type: "object",
    nullable: true,
    additionalProperties: true,
    example: { key: "value" },
  })
  @Field(() => JsonObject, { nullable: true })
  @IsOptional()
  @IsObject()
  jsonObject?: any;

  // Tipos geoespaciales
  @ApiProperty({
    type: "object",
    nullable: true,
    properties: {
      x: { type: "number" },
      y: { type: "number" },
    },
    additionalProperties: false,
  })
  @Field(() => JsonObject, { nullable: true })
  @IsOptional()
  @IsJSON()
  pointValue?: { x: number; y: number };

  @ApiProperty({
    type: "object",
    nullable: true,
    properties: {
      coordinates: {
        type: "array",
        items: {
          type: "array",
          items: {
            type: "array",
            items: { type: "number" },
          },
        },
      },
    },
    additionalProperties: false,
  })
  @Field(() => JsonObject, { nullable: true })
  @IsOptional()
  @IsJSON()
  polygonValue?: { coordinates: number[][][] };

  // Tipos compuestos
  @ApiProperty({ type: [String], nullable: true })
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  stringArray?: string[];

  @ApiProperty({ type: [Number], nullable: true })
  @Field(() => [Float], { nullable: true })
  @IsOptional()
  @IsArray()
  numberArray?: number[];

  // Tipos enumerados
  @ApiProperty({
    enum: ["ACTIVE", "INACTIVE", "PENDING"],
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(["ACTIVE", "INACTIVE", "PENDING"])
  statusEnum?: string;

  // Tipos para relaciones
  @ApiProperty({ type: String, nullable: true })
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  relationId?: string;

  @ApiProperty({
    type: "object",
    nullable: true,
    additionalProperties: true,
  })
  @Field(() => JsonObject, { nullable: true })
  @IsOptional()
  @IsObject()
  embeddedRelation?: Record<string, any>;

  // Tipos especializados
  @ApiProperty({
    type: String,
    format: "uuid",
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  uuidValue?: string;

  @ApiProperty({
    type: String,
    format: "xml",
    nullable: true,
  })
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  xmlValue?: string;

  // Tipos de rango
  @ApiProperty({
    type: "object",
    nullable: true,
    properties: {
      from: { type: "number" },
      to: { type: "number" },
    },
    additionalProperties: false,
  })
  @Field(() => JsonObject, { nullable: true })
  @IsOptional()
  @IsJSON()
  intRange?: { from: number; to: number };

  @ApiProperty({
    type: "object",
    nullable: true,
    properties: {
      from: { type: "string", format: "date" },
      to: { type: "string", format: "date" },
    },
    additionalProperties: false,
  })
  @Field(() => JsonObject, { nullable: true })
  @IsOptional()
  @IsJSON()
  dateRange?: { from: string; to: string };
}
