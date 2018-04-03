import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductMgmtRoutingModule } from './product-mgmt-routing.module';
//Component
import {ProductMgmtComponent} from './product-mgmt.component';
import {ItemListComponent} from './item-list/item-list.component';
import {ProductDefinitionComponent} from './product-definition/product-definition.component';
import {ProductDefinitionCreateComponent} from './product-definition/product-definition-create.component';
import {BundleMgmtComponent} from './bundle-mgmt/bundle-mgmt.component';
import {BundleMgmtCreateComponent} from './bundle-mgmt/bundle-mgmt-create.component';
import {BundleMgmtEditComponent} from './bundle-mgmt/bundle-mgmt-edit.component';
import {ConditionProductGroupComponent} from './condition-product-group/condition-product-group.component';
import {ConditionProductGroupCreateComponent} from './condition-product-group/condition-product-group-create.component';
import {ConditionProductGroupEditComponent} from './condition-product-group/condition-product-group-edit.component';
import {ECatalogComponent} from './e-catalog/e-catalog.component';
import {ECatalogCreateComponent} from './e-catalog/e-catalog-create.component';
import {ECatalogEditComponent} from './e-catalog/e-catalog-edit.component';
//Services
import {ProductService} from './product-mgmt.service';
import { CommonShareModule, PageHeaderModule } from '../../shared/index';
import { TableService } from "../../services/index";

import { ItemModalModule } from "../../shared/modals/item.module";


@NgModule({
  imports: [
    CommonModule,
    ProductMgmtRoutingModule,
    CommonShareModule,
    PageHeaderModule,
    ItemModalModule

  ],
  declarations: [
    ProductMgmtComponent,
    ItemListComponent,
    BundleMgmtComponent,
    ConditionProductGroupComponent,
    ECatalogComponent,
    ProductDefinitionComponent,
    ProductDefinitionCreateComponent,
    BundleMgmtCreateComponent,
    BundleMgmtEditComponent,
    ConditionProductGroupCreateComponent,
    ConditionProductGroupEditComponent,
    ECatalogCreateComponent,
    ECatalogEditComponent

    ],
    providers:[ProductService,TableService],
    entryComponents:[]
})
export class ProductMgmtModule { }
