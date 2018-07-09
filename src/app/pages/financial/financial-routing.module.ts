import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InvoiceComponent } from './ar-invoice/invoice.component';
import { InvoiceCreateComponent } from './ar-invoice/invoice.create.component';
import { InvoiceDetailComponent } from './ar-invoice/invoice.view.component';
import { PaymentComponent } from './payment/payment.component';


const routes: Routes = [
    {
        path: 'invoice',
        children: [
            { path: '', component: InvoiceComponent },
            { path: 'create', component: InvoiceCreateComponent },
            { path: 'detail/:id', component: InvoiceDetailComponent }
        ]
    },
    {
        path: 'payment',
        children: [
            { path: '', component: InvoiceComponent }
        ]
    }


];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FinancialRoutingModule { }
