import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Buyer rfq
import { BuyerRfqComponent } from './buyer-rfq/buyer-rfq.component';

//Delievery order
import { DeliveryOrderComponent } from './delivery-order/delivery-order.component';
import { DelieveryOrderCreateComponent } from './delivery-order/delivery-order-create.component';
import { DelieveryOrderDetailComponent } from './delivery-order/delivery-order-detail.component';

//Sale Order
import { SaleOrderComponent } from './sale-order/sale-order.component';

//Sale Price
import { SalePriceComponent } from './sale-price/sale-price.component';
import { SalePriceCreateComponent } from './sale-price/sale-price-create.component';
import { SalePriceEditComponent } from './sale-price/sale-price-edit.component';

//Sale Quotation
import { SaleQuotationComponent } from './sale-quotation/sale-quotation.component';


const routes: Routes = [
    {
        path: 'buyer-rfq',
        children: [
            { path: '', component: BuyerRfqComponent }
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
            { path: 'detail/:id', component: DelieveryOrderDetailComponent}
        ]
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrderMgmtRoutingModule { }
