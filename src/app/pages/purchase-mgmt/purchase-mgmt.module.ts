import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseManagementRoutingModule } from './purchase-mgmt-routing.module';
import { PurchaseManagementComponent } from './purchase-mgmt.component';

import { QuotationComponent } from './purchase-quotation/purchase-quotation.component';
import { QuotationCreateComponent } from './purchase-quotation/purchase-quotation-create.component';

@NgModule({
  imports: [
    CommonModule,
    PurchaseManagementRoutingModule
  ],
  declarations: [PurchaseManagementComponent, QuotationComponent, QuotationCreateComponent]
})
export class PurchaseManagementModule { }
