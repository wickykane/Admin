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
  declarations: [RmaComponent],
  providers:[RmaService,TableService,PurchaseService]
})
export class RmaModule { }
