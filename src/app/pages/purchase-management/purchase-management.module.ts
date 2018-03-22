import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseManagementRoutingModule } from './purchase-management-routing.module';
import { PurchaseManagementComponent } from './purchase-management.component';

import { QuotationComponent } from './quotation/quotation.component';
import { QuotationCreateComponent } from './quotation/quotation-create.component';

@NgModule({
  imports: [
    CommonModule,
    PurchaseManagementRoutingModule
  ],
  declarations: [PurchaseManagementComponent, QuotationComponent, QuotationCreateComponent]
})
export class PurchaseManagementModule { }
