import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import { PageHeaderModule } from '../../shared';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {PurchaseManagementRoutingModule} from './purchase-mgmt-routing.module';

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

import { PurchaseService } from './purchase.service';
// Table Service
import { CommonShareModule } from '../../shared/index';
import { TableService } from '../../services/index';

// Modal
import { ItemModalModule } from '../../shared/modals/item.module';


@NgModule({
  imports: [
    CommonModule,
    PageHeaderModule,
    PurchaseManagementRoutingModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    CommonShareModule,
    ItemModalModule
  ],
  declarations: [
    QuotationComponent,
    QuotationCreateComponent,
    QuotationDetailComponent,
    PurchaseOrderComponent,
    PurchaseOrderCreateComponent,
    PurchaseOrderDetailComponent,
    SupplierComponent,
    SupplierCreateComponent,
    SupplierDetailComponent,
    InboundDeliveryComponent,
    WarehouseReceiptComponent,
    WarehouseReceiptCreateComponent
],
providers:[TableService,PurchaseService],
entryComponents:[]
})
export class PurchaseManagementModule {}
