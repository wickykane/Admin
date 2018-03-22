import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseManagementRoutingModule } from "./promotion-mgmt-routing.module";
import { PromotionBudgetComponent } from './promotion-budget/promotion-budget.component';
import { PromotionCampaignComponent } from './promotion-campaign/promotion-campaign.component';

@NgModule({
  imports: [
    CommonModule,
    PurchaseManagementRoutingModule
  ],
  declarations: [PromotionBudgetComponent, PromotionCampaignComponent]
})
export class PromotionMgmtModule { }
