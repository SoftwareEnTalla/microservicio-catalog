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


import { ObjectType, Field } from "@nestjs/graphql";
import { GQResponseBase } from "src/common/types/common.types";
import { SettlementMode } from "../entities/settlement-mode.entity";
import { ApiProperty } from "@nestjs/swagger";

@ObjectType({ description: "Respuesta de settlementmode" })
export class SettlementModeResponse<T extends SettlementMode> extends GQResponseBase {
  @ApiProperty({ type: SettlementMode,nullable:false,description:"Datos de respuesta de SettlementMode" })
  @Field(() => SettlementMode, { description: "Instancia de SettlementMode", nullable: true })
  data?: T;


}

@ObjectType({ description: "Respuesta de settlementmodes" })
export class SettlementModesResponse<T extends SettlementMode> extends GQResponseBase {
  @ApiProperty({ type: [SettlementMode],nullable:false,description:"Listado de SettlementMode",default:[] })
  @Field(() => [SettlementMode], { description: "Listado de SettlementMode", nullable: false,defaultValue:[] })
  data: T[] = [];

  @ApiProperty({ type: Number,nullable:false,description:"Cantidad de SettlementMode",default:0 })
  @Field(() => Number, { description: "Cantidad de SettlementMode", nullable: false,defaultValue:0 })
  count: number = 0;
}






