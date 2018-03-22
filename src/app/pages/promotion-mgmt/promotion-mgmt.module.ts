import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromotionBudgetComponent } from './promotion-budget/promotion-budget.component';
import { PromotionCampaignComponent } from './promotion-campaign/promotion-campaign.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PromotionBudgetComponent, PromotionCampaignComponent]
})
export class PromotionMgmtModule { }
