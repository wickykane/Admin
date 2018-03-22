import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PurchaseManagementComponent } from './purchase-management.component';
import { QuotationComponent } from './quotation/quotation.component';
import { QuotationCreateComponent } from './quotation/quotation-create.component';

const routes: Routes = [
    {
        path: '', component: PurchaseManagementComponent
    },
    {
        path: 'purchase-quotation', component: QuotationComponent
    },
    {
        path: 'purchase-quotation/create', component: QuotationCreateComponent
    }



];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PurchaseManagementRoutingModule { }
