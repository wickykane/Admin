import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageHeaderModule } from '../../../shared';

import { ShippingZoneComponent } from './list/shipping-zone.component';
import { ShippingZoneRoutingModule } from './shipping-zone-routing.module';

import { TableService } from '../../../services/index';
// Table Service
import { CommonShareModule } from '../../../shared/index';
import { CustomerService } from '../../customer-mgmt/customer.service';
import { PurchaseService } from '../../purchase-mgmt/purchase.service';
import { ShippingZoneCreateComponent } from './create/shipping-zone.create.component';
import { ShippingZoneService } from './shipping-zone.service';

@NgModule({
  imports: [
    CommonModule,
    PageHeaderModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CommonShareModule,
    ShippingZoneRoutingModule
  ],
  declarations: [ShippingZoneComponent, ShippingZoneCreateComponent],
  providers: [ShippingZoneService, TableService, PurchaseService, CustomerService]
})
export class ShippingZoneModule { }
