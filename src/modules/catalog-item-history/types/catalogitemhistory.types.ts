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
import { CatalogItemHistory } from "../entities/catalog-item-history.entity";
import { ApiProperty } from "@nestjs/swagger";

@ObjectType({ description: "Respuesta de catalogitemhistory" })
export class CatalogItemHistoryResponse<T extends CatalogItemHistory> extends GQResponseBase {
  @ApiProperty({ type: CatalogItemHistory,nullable:false,description:"Datos de respuesta de CatalogItemHistory" })
  @Field(() => CatalogItemHistory, { description: "Instancia de CatalogItemHistory", nullable: true })
  data?: T;


}

@ObjectType({ description: "Respuesta de catalogitemhistorys" })
export class CatalogItemHistorysResponse<T extends CatalogItemHistory> extends GQResponseBase {
  @ApiProperty({ type: [CatalogItemHistory],nullable:false,description:"Listado de CatalogItemHistory",default:[] })
  @Field(() => [CatalogItemHistory], { description: "Listado de CatalogItemHistory", nullable: false,defaultValue:[] })
  data: T[] = [];

  @ApiProperty({ type: Number,nullable:false,description:"Cantidad de CatalogItemHistory",default:0 })
  @Field(() => Number, { description: "Cantidad de CatalogItemHistory", nullable: false,defaultValue:0 })
  count: number = 0;
}






