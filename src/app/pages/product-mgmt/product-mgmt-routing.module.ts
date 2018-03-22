import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ProductMgmtComponent} from './product-mgmt.component';
import {ItemListComponent} from './item-list/item-list.component';

const routes : Routes = [
  {
    path: '',
    component: ProductMgmtComponent
  }, {
    path: 'item-list',
    component: ItemListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductMgmtRoutingModule {}