import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BundleMgmtComponent } from './bundle-mgmt/bundle-mgmt.component';
import { ConditionProductGroupComponent } from './condition-product-group/condition-product-group.component';
import { ECatalogComponent } from './e-catalog/e-catalog.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ProductDefinitionComponent } from './product-definition/product-definition.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [BundleMgmtComponent, ConditionProductGroupComponent, ECatalogComponent, ItemListComponent, ProductDefinitionComponent]
})
export class ProductMgmtModule { }
