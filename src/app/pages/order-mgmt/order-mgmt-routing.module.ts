import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BuyerRfqComponent } from './buyer-rfq/buyer-rfq.component';

//  Delievery order
import { DelieveryOrderCreateComponent } from './delivery-order/delivery-order-create.component';
import { DelieveryOrderDetailComponent } from './delivery-order/delivery-order-detail.component';
import { DeliveryOrderComponent } from './delivery-order/delivery-order.component';

//  Sale Order
import { SaleOrderComponent } from './sale-order/sale-order.component';
import { SaleOrderCreateComponent } from './sale-order/sale-order.create.component';
import { SaleOrderDetailComponent } from './sale-order/sale-order.detail.component';


import { SalePriceCreateComponent } from './sale-price/sale-price-create.component';
import { SalePriceEditComponent } from './sale-price/sale-price-edit.component';
import { SalePriceComponent } from './sale-price/sale-price.component';

//  Sale Quotation
import { SaleQuotationComponent } from './sale-quotation/sale-quotation.component';
import {SaleQuotationCreateComponent} from './sale-quotation/sale-quotation.create.component';
import {SaleQuotationDetailComponent} from './sale-quotation/sale-quotation.detail.component';
import {SaleQuotationRfqCreateComponent} from './sale-quotation/sale-quotation.rfq.create.component';

const routes: Routes = [
  {
    path: 'buyer-rfq',
    component: BuyerRfqComponent
  },
  {
    path: 'sale-order',
    children: [
      { path: '', component: SaleOrderComponent },
      { path: 'create', component: SaleOrderCreateComponent },
      { path: 'detail/:id', component: SaleOrderDetailComponent }
    ]
  },
  {
    path: 'sale-quotation',
    children: [
      { path: '', component: SaleQuotationComponent },
      {path: 'create', component: SaleQuotationCreateComponent},
      {path: 'detail/:id', component: SaleQuotationDetailComponent},
      {path: 'create/rfq/:id', component: SaleQuotationRfqCreateComponent}
    ]
  },
  {
    path: 'sales-price',
    children: [
      { path: '', component: SalePriceComponent },
      { path: 'create', component: SalePriceCreateComponent },
      { path: 'edit/:id', component: SalePriceEditComponent }
    ]
},
{
  path: 'delivery-order',
  children: [
    { path: '', component: DeliveryOrderComponent },
    { path: 'create', component: DelieveryOrderCreateComponent },
    { path: 'detail/:id', component: DelieveryOrderDetailComponent }
  ]
}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrderMgmtRoutingModule { }
