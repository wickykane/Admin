import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseManagementRoutingModule } from "./promotion-mgmt-routing.module";
import { PromotionBudgetComponent } from './promotion-budget/promotion-budget.component';
import { PromotionBudgetCreateComponent } from './promotion-budget/promotion-budget.create.component';
import { PromotionBudgetEditComponent } from './promotion-budget/promotion-budget.edit.component';

import { PromotionCampaignComponent } from './promotion-campaign/promotion-campaign.component';
import { CommonShareModule } from '../../shared/index';
import { TableService } from "../../services/index";
import { PromotionService } from "./promotion.service";

//Modal
import { PromotionModalContent } from "./modals/promotion.modal";

@NgModule({
  imports: [
    CommonModule,
    PurchaseManagementRoutingModule,
    CommonShareModule
  ],
  declarations: [PromotionBudgetComponent, PromotionCampaignComponent, PromotionBudgetCreateComponent, PromotionBudgetEditComponent, PromotionModalContent ],
  providers:[TableService,PromotionService],
  entryComponents:[PromotionModalContent]
})
export class PromotionMgmtModule { }
