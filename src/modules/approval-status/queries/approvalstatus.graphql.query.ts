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

import { Query, Resolver, Args } from '@nestjs/graphql'; 
import { ApprovalStatusDto } from '../dtos/all-dto';
import { ApprovalStatusGraphqlService } from '../services/approvalstatus.graphql.service';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => ApprovalStatusDto)
export class ApprovalStatusGraphqlQuery {
  constructor(private readonly service: ApprovalStatusGraphqlService) {}

  @Query(() => [ApprovalStatusDto], { name: 'findAllApprovalStatuss' })
  async findAll(): Promise<ApprovalStatusDto[]> {
    return this.service.findAll();
  }

  @Query(() => ApprovalStatusDto, { name: 'findApprovalStatusById' })
  async findById(
    @Args('id', { type: () => String }) id: string
  ): Promise<ApprovalStatusDto> {
    const result = await this.service.findById(id);
    if (!result) {
      throw new NotFoundException("ApprovalStatus con id " + id + " no encontrado");
    }
    return result;
  }
}
