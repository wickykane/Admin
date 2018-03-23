import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import { PageHeaderModule } from '../../shared';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {PurchaseManagementRoutingModule} from './purchase-mgmt-routing.module';

import {QuotationComponent} from './purchase-quotation/purchase-quotation.component';
import {QuotationCreateComponent} from './purchase-quotation/purchase-quotation-create.component';

import {SupplierComponent} from './supplier/supplier.component';
import {PurchaseOrderComponent} from './purchase-order/purchase-order.component';
import {InboundDeliveryComponent} from './inbound-delivery/inbound-delivery.component';
import {WarehouseReceiptComponent} from './warehouse-receipt/warehouse-receipt.component';

import { CommonShareModule } from '../../shared/index';
import { TableService } from "../../services/index";
import { PurchaseService } from "./purchase.service";

@NgModule({
  imports: [
    CommonModule,
    PageHeaderModule,
    PurchaseManagementRoutingModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    CommonShareModule,
  ],
  declarations: [
    QuotationComponent,
    QuotationCreateComponent,
    SupplierComponent,
    PurchaseOrderComponent,
    InboundDeliveryComponent,
    WarehouseReceiptComponent
],
providers:[TableService,PurchaseService]
})
export class PurchaseManagementModule {}
