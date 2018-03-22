import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductMgmtRoutingModule } from './product-mgmt-routing.module';
import { ProductMgmtComponent } from './product-mgmt.component';
import {ItemListComponent} from './item-list/item-list.component';


@NgModule({
  imports: [
    CommonModule,
    ProductMgmtRoutingModule
  ],
  declarations: [
    ProductMgmtComponent,
    ItemListComponent]
})
export class ProductMgmtModule { }
