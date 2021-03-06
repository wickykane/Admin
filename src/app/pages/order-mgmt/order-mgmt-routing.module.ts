import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//  Sale Order
import { SaleOrderCreateComponent } from './sale-order/create/sale-order.create.component';
import { SaleOrderEditComponent } from './sale-order/edit/sale-order.edit.component';
import { SaleOrderComponent } from './sale-order/sale-order.component';
import { SaleOrderDetailComponent } from './sale-order/view/sale-order.detail.component';

//  Sale Quotation
import { SaleQuotationCreateComponent } from './sale-quotation/create/sale-quotation.create.component';
import { SaleQuotationEditComponent } from './sale-quotation/edit/sale-quotation.edit.component';
import { SaleQuotationComponent } from './sale-quotation/sale-quotation.component';
import { SaleQuotationDetailComponent } from './sale-quotation/view/sale-quotation.detail.component';

import { RmaCreateComponent } from './rma/create/rma.create.component';
import { RmaEditComponent } from './rma/edit/rma.edit.component';
import { RmaComponent } from './rma/list/rma.component';
import { RmaDetailComponent } from './rma/view/rma.view.component';

import { MasterGuard } from '../../shared';

const routes: Routes = [
  {
    path: 'sale-order',
    children: [
      { path: '', component: SaleOrderComponent, canActivate: [MasterGuard] },
      { path: 'create', component: SaleOrderCreateComponent, canActivate: [MasterGuard] },
      { path: 'edit/:id', component: SaleOrderEditComponent, canActivate: [MasterGuard] },
      { path: 'detail/:id', component: SaleOrderDetailComponent, canActivate: [MasterGuard] }
    ]
  },
  {
    path: 'sale-quotation',
    children: [
      { path: '', component: SaleQuotationComponent, canActivate: [MasterGuard] },
      { path: 'create', component: SaleQuotationCreateComponent, canActivate: [MasterGuard] },
      { path: 'edit/:id', component: SaleQuotationEditComponent, canActivate: [MasterGuard] },
      { path: 'detail/:id', component: SaleQuotationDetailComponent, canActivate: [MasterGuard] },
    ]
  },
  {
    path: 'return-order',
    children: [
      { path: '', component: RmaComponent, canActivate: [MasterGuard] },
      { path: 'create', component: RmaCreateComponent, canActivate: [MasterGuard] },
      { path: 'edit/:id', component: RmaEditComponent, canActivate: [MasterGuard] },
      { path: 'detail/:id', component: RmaDetailComponent, canActivate: [MasterGuard] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderMgmtRoutingModule { }
