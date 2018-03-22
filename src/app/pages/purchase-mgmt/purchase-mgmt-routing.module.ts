import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { QuotationComponent } from './purchase-quotation/purchase-quotation.component';
import { QuotationCreateComponent } from './purchase-quotation/purchase-quotation-create.component';

const routes: Routes = [
    {
        path: 'purchase-quotation',
        children : [
            { path: '', component: QuotationComponent },
            { path: 'create', component: QuotationCreateComponent },

        ]
    },


];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PurchaseManagementRoutingModule { }
