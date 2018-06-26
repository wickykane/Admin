import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PromotionBudgetComponent } from './promotion-budget/promotion-budget.component';
import { PromotionBudgetCreateComponent } from './promotion-budget/promotion-budget.create.component';
import { PromotionBudgetEditComponent } from './promotion-budget/promotion-budget.edit.component';
import { PurchaseManagementRoutingModule } from './promotion-mgmt-routing.module';

import { PromotionCampaignComponent } from './promotion-campaign/promotion-campaign.component';
import { PromotionCampaignCreateComponent } from './promotion-campaign/promotion-campaign.create.component';
import { PromotionCampaignEditComponent } from './promotion-campaign/promotion-campaign.edit.component';

import { TableService } from '../../services/index';
import { CommonShareModule } from '../../shared/index';
import { PromotionService } from './promotion.service';

//  Modal
import { PromotionInvoiceModalContent } from './modals/promotion-invoice.modal';
import { PromotionModalContent } from './modals/promotion.modal';


@NgModule({
  imports: [
    CommonModule,
    PurchaseManagementRoutingModule,
    CommonShareModule
  ],
  declarations: [PromotionBudgetComponent, PromotionCampaignComponent,
     PromotionBudgetCreateComponent, PromotionBudgetEditComponent,
      PromotionModalContent, PromotionCampaignCreateComponent,
       PromotionInvoiceModalContent, PromotionCampaignEditComponent ],
  providers: [ TableService, PromotionService],
  entryComponents: [PromotionModalContent, PromotionInvoiceModalContent]
})
export class PromotionMgmtModule { }
