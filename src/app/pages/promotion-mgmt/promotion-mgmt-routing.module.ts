import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PromotionBudgetComponent } from "./promotion-budget/promotion-budget.component";
import { PromotionCampaignComponent } from "./promotion-campaign/promotion-campaign.component";


const routes: Routes = [
    {
        path: 'budget', 
        children : [
            { path: '', component: PromotionBudgetComponent },
        ]
    },
  
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PurchaseManagementRoutingModule { }
