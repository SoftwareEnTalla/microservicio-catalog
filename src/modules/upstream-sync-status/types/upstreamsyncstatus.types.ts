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
import { UpstreamSyncStatus } from "../entities/upstream-sync-status.entity";
import { ApiProperty } from "@nestjs/swagger";

@ObjectType({ description: "Respuesta de upstreamsyncstatus" })
export class UpstreamSyncStatusResponse<T extends UpstreamSyncStatus> extends GQResponseBase {
  @ApiProperty({ type: UpstreamSyncStatus,nullable:false,description:"Datos de respuesta de UpstreamSyncStatus" })
  @Field(() => UpstreamSyncStatus, { description: "Instancia de UpstreamSyncStatus", nullable: true })
  data?: T;


}

@ObjectType({ description: "Respuesta de upstreamsyncstatuss" })
export class UpstreamSyncStatussResponse<T extends UpstreamSyncStatus> extends GQResponseBase {
  @ApiProperty({ type: [UpstreamSyncStatus],nullable:false,description:"Listado de UpstreamSyncStatus",default:[] })
  @Field(() => [UpstreamSyncStatus], { description: "Listado de UpstreamSyncStatus", nullable: false,defaultValue:[] })
  data: T[] = [];

  @ApiProperty({ type: Number,nullable:false,description:"Cantidad de UpstreamSyncStatus",default:0 })
  @Field(() => Number, { description: "Cantidad de UpstreamSyncStatus", nullable: false,defaultValue:0 })
  count: number = 0;
}






