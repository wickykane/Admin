import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { InvoiceComponent } from './ar-invoice/invoice.component';
import { PaymentComponent } from './payment/payment.component';


const routes: Routes = [
    {
        path: 'invoice',
        children: [
            { path: '', component: InvoiceComponent }
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
