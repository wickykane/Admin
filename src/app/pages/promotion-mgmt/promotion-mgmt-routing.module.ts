import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PromotionBudgetComponent } from "./promotion-budget/promotion-budget.component";
import { PromotionBudgetCreateComponent } from './promotion-budget/promotion-budget.create.component';
import { PromotionBudgetEditComponent } from './promotion-budget/promotion-budget.edit.component';

import { PromotionCampaignComponent } from "./promotion-campaign/promotion-campaign.component";
import { PromotionCampaignCreateComponent } from "./promotion-campaign/promotion-campaign.create.component";


const routes: Routes = [
    {
        path: 'budget', 
        children : [
            { path: '', component: PromotionBudgetComponent },
            { path: 'create', component: PromotionBudgetCreateComponent },
            { path: 'edit/:id', component: PromotionBudgetEditComponent },
            
            
        ]
    },
    {
        path: 'campaign', 
        children : [
            { path: '', component: PromotionCampaignComponent },
            { path: 'create', component: PromotionCampaignCreateComponent },
            { path: 'edit/:id', component: PromotionBudgetEditComponent },
            
            
        ]
    },
  
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PurchaseManagementRoutingModule { }
