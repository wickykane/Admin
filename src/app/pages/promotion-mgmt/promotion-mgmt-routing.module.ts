import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PromotionBudgetComponent } from "./promotion-budget/promotion-budget.component";
import { PromotionBudgetCreateComponent } from './promotion-budget/promotion-budget.create.component';

import { PromotionCampaignComponent } from "./promotion-campaign/promotion-campaign.component";


const routes: Routes = [
    {
        path: 'budget', 
        children : [
            { path: '', component: PromotionBudgetComponent },
            { path: 'create', component: PromotionBudgetCreateComponent },
            
        ]
    },
  
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PurchaseManagementRoutingModule { }
