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
import { ShippingZoneCreateComponent } from './create/shipping-zone.create.component';
import { ShippingZoneEditComponent } from './edit/shipping-zone.edit.component';
import { ShippingZoneService } from './shipping-zone.service';
import { ShippingZoneViewComponent } from './view/shipping-zone.view.component';
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
  declarations: [ShippingZoneComponent, ShippingZoneCreateComponent, ShippingZoneEditComponent, ShippingZoneViewComponent],
  providers: [ShippingZoneService, TableService]
})
export class ShippingZoneModule { }
