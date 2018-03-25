import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { QuotationComponent } from './purchase-quotation/purchase-quotation.component';
import { QuotationCreateComponent } from './purchase-quotation/purchase-quotation-create.component';
import { QuotationDetailComponent} from './purchase-quotation/purchase-quotation-detail.component';

const routes: Routes = [
    {
        path: 'purchase-quotation',
        children : [
            { path: '', component: QuotationComponent },
            { path: 'create', component: QuotationCreateComponent },
            { path: 'detail/:id', component: QuotationDetailComponent }
        ]
    },


];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PurchaseManagementRoutingModule { }
