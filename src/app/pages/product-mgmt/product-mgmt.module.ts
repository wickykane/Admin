import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductMgmtRoutingModule } from './product-mgmt-routing.module';
import { ProductMgmtComponent } from './product-mgmt.component';
import {ItemListComponent} from './item-list/item-list.component';
import {BundleMgmtComponent} from './bundle-mgmt/bundle-mgmt.component';
import {ConditionProductGroupComponent} from './condition-product-group/condition-product-group.component';
import {ECatalogComponent} from './e-catalog/e-catalog.component';
import {ProductDefinitionComponent} from './product-definition/product-definition.component';


@NgModule({
  imports: [
    CommonModule,
    ProductMgmtRoutingModule
  ],
  declarations: [
    ProductMgmtComponent,
    ItemListComponent,
    BundleMgmtComponent,
    ConditionProductGroupComponent,
    ECatalogComponent,
    ProductDefinitionComponent]
})
export class ProductMgmtModule { }
