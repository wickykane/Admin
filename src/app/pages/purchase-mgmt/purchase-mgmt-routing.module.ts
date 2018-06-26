import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Quotation
import {QuotationComponent} from './purchase-quotation/purchase-quotation.component';
import {QuotationCreateComponent} from './purchase-quotation/purchase-quotation-create.component';
import {QuotationDetailComponent} from './purchase-quotation/purchase-quotation-detail.component';

// Order
import {PurchaseOrderComponent} from './purchase-order/purchase-order.component';
import {PurchaseOrderCreateComponent} from './purchase-order/purchase-order-create.component';
import {PurchaseOrderDetailComponent} from './purchase-order/purchase-order-detail.component';

import {InboundDeliveryComponent} from './inbound-delivery/inbound-delivery.component';

// Supplier
import {SupplierComponent} from './supplier/supplier.component';
import {SupplierCreateComponent} from './supplier/supplier-create.component';
import {SupplierDetailComponent} from './supplier/supplier-detail.component';

// warehouse-receipt
import {WarehouseReceiptComponent} from './warehouse-receipt/warehouse-receipt.component';
import {WarehouseReceiptCreateComponent} from './warehouse-receipt/warehouse-receipt-create.component';

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
    },
    {
        path: 'warehouse-receipt',
        children : [
            { path: '', component: WarehouseReceiptComponent },
            { path: 'create', component: WarehouseReceiptCreateComponent }
        ]
    },
    {
        path: 'supplier',
        children : [
            { path: '', component: SupplierComponent },
            { path: 'create', component: SupplierCreateComponent },
            { path: 'detail/:id', component: SupplierDetailComponent }
        ]
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PurchaseManagementRoutingModule { }
