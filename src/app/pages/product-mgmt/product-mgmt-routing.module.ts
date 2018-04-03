import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

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
    children:[
      {path:'',component: ProductDefinitionComponent},
      {path:'create',component: ProductDefinitionCreateComponent}
    ]
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
    children:[
      {path:'',component: ConditionProductGroupComponent},
      {path:'create',component: ConditionProductGroupCreateComponent},
      {path:'edit/:id',component:ConditionProductGroupEditComponent}
    ]
    
  },
  {
    path: 'e-catalog',
    children:[
      {path:'',component: ECatalogComponent},
      {path:'create',component:ECatalogCreateComponent},
      {path:'edit/:id',component:ECatalogEditComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductMgmtRoutingModule {}