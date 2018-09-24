import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageHeaderModule } from '../../shared';

import { RmaComponent } from './list/rma.component';
import { RmaRoutingModule } from './rma-routing.module';

import { TableService } from '../../services/index';
// Table Service
import { CommonShareModule } from '../../shared/index';
import { CustomerService } from '../customer-mgmt/customer.service';
import { RmaCreateComponent } from './create/rma.create.component';
import { RmaEditComponent } from './edit/rma.edit.component';
import { RmaService } from './rma.service';

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
  providers: [RmaService, TableService, CustomerService]
})
export class RmaModule { }
