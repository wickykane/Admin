import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderModule } from '../../shared';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {RmaRoutingModule} from './rma-routing.module';
import { RmaComponent } from './rma.component';

import { RmaService } from "./rma.service";
import {PurchaseService} from '../purchase-mgmt/purchase.service';
//Table Service
import { CommonShareModule } from '../../shared/index';
import { TableService } from "../../services/index";
import {CustomerService} from '../customer-mgmt/customer.service';
import { RmaCreateComponent } from './rma.create.component';
import { RmaEditComponent } from './rma.edit.component';

@NgModule({
  imports: [
    CommonModule,
    PageHeaderModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CommonShareModule,
    RmaRoutingModule
  ],
  declarations: [RmaComponent, RmaCreateComponent, RmaEditComponent],
  providers:[RmaService,TableService,PurchaseService,CustomerService]
})
export class RmaModule { }
