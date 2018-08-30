import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InvoiceCreateComponent } from './ar-invoice/create/invoice.create.component';
import { InvoiceComponent } from './ar-invoice/invoice.component';
import { InvoiceDetailComponent } from './ar-invoice/view/invoice.view.component';
import { PaymentComponent } from './payment/payment.component';
import { CreditMemoListComponent } from './credit-memo//list/credit-memo-list.component';
import { CreditMemoCreateComponent } from './credit-memo//create/credit-memo-create.component';
const routes: Routes = [
    {
        path: 'invoice',
        children: [
            { path: '', component: InvoiceComponent },
            { path: 'create', component: InvoiceCreateComponent },
            { path: 'view/:id', component: InvoiceDetailComponent },
            { path: 'edit/:id', component: InvoiceCreateComponent }
        ]
    },
    {
        path: 'payment',
        children: [
            { path: '', component: InvoiceComponent }
        ]
    },
    {
        path: 'creditMemo',
        children: [
            { path: '', component: CreditMemoListComponent },
            { path: 'create', component: CreditMemoCreateComponent },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FinancialRoutingModule { }
