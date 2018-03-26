import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuotationComponent } from './purchase-quotation/purchase-quotation.component';
import { QuotationCreateComponent } from './purchase-quotation/purchase-quotation-create.component';
import { QuotationDetailComponent} from './purchase-quotation/purchase-quotation-detail.component';

import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { PurchaseOrderCreateComponent } from './purchase-order/purchase-order-create.component';
import { PurchaseOrderDetailComponent } from './purchase-order/purchase-order-detail.component';

import { InboundDeliveryComponent } from './inbound-delivery/inbound-delivery.component';

const routes: Routes = [
    {
        path: 'purchase-quotation',
        children : [
            { path: '', component: QuotationComponent },
            { path: 'create', component: QuotationCreateComponent },
            { path: 'detail/:id', component: QuotationDetailComponent }
        ]
    },
    {
        path: 'purchase-order',
        children : [
            { path: '', component: PurchaseOrderComponent },
            { path: 'create', component: PurchaseOrderCreateComponent },
            { path: 'detail/:id', component: PurchaseOrderDetailComponent }
        ]
    },
    {
        path: 'inbound-delivery',
        children : [
            { path: '', component: InboundDeliveryComponent }
        ]
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PurchaseManagementRoutingModule { }
