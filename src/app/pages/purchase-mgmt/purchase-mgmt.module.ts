import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PurchaseManagementRoutingModule} from './purchase-mgmt-routing.module';
import {PurchaseManagementComponent} from './purchase-mgmt.component';

import {QuotationCreateComponent} from './purchase-quotation/purchase-quotation-create.component';
import {SupplierComponent} from './supplier/supplier.component';
import {PurchaseOrderComponent} from './purchase-order/purchase-order.component';
import {InboundDeliveryComponent} from './inbound-delivery/inbound-delivery.component';
import {WarehouseReceiptComponent} from './warehouse-receipt/warehouse-receipt.component';

@NgModule({
  imports: [
    CommonModule, PurchaseManagementRoutingModule
  ],
  declarations: [
    PurchaseManagementComponent,
    QuotationCreateComponent,
    SupplierComponent,
    PurchaseOrderComponent,
    InboundDeliveryComponent,
    WarehouseReceiptComponent
  ]
})
export class PurchaseManagementModule {}