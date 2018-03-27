import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ProductMgmtComponent} from './product-mgmt.component';
import {ItemListComponent} from './item-list/item-list.component';
import {ProductDefinitionComponent} from './product-definition/product-definition.component';
import {BundleMgmtComponent} from './bundle-mgmt/bundle-mgmt.component';
import {BundleMgmtCreateComponent} from './bundle-mgmt/bundle-mgmt-create.component';
import {BundleMgmtEditComponent} from './bundle-mgmt/bundle-mgmt-edit.component';
import {ConditionProductGroupComponent} from './condition-product-group/condition-product-group.component';
import {ECatalogComponent} from './e-catalog/e-catalog.component';

const routes : Routes = [
  {
    path: '',
    component: ProductMgmtComponent
  }, {
    path: 'item-list',
    component: ItemListComponent
  },
  {
    path: 'product-definition',
    component: ProductDefinitionComponent
  },
  {
    path: 'bundle',
    children:[
      {path:'',component:BundleMgmtComponent},
      {path:'create',component:BundleMgmtCreateComponent},
      {path:'edit/:id',component:BundleMgmtEditComponent},
    ]    
  },
  {
    path: 'condition-product',
    component: ConditionProductGroupComponent
  },
  {
    path: 'e-catalog',
    component: ECatalogComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductMgmtRoutingModule {}