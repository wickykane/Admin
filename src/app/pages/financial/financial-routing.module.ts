import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InvoiceCreateComponent } from './ar-invoice/create/invoice.create.component';
import { InvoiceEditComponent } from './ar-invoice/edit/invoice.edit.component';
import { InvoiceComponent } from './ar-invoice/invoice.component';
import { InvoiceDetailComponent } from './ar-invoice/view/invoice.view.component';
import { PaymentComponent } from './payment/payment.component';

import { DebitMemoCreateComponent } from './debit-memo/create/debit-memo-create.component';
import { DebitMemoEditComponent } from './debit-memo/edit/debit-memo-edit.component';
import { DebitMemoListComponent } from './debit-memo/list/debit-memo-list.component';
import { DebitMemoViewComponent } from './debit-memo/view/debit-memo-view.component';

const routes: Routes = [
    {
        path: 'invoice',
        children: [
            { path: '', component: InvoiceComponent },
            { path: 'create', component: InvoiceCreateComponent },
            { path: 'view/:id', component: InvoiceDetailComponent },
            { path: 'edit/:id', component: InvoiceEditComponent }
        ]
    },
    {
        path: 'payment',
        children: [
            { path: '', component: InvoiceComponent }
        ]
    },
    {
        path: 'debit-memo',
        children: [
            { path: '', component: DebitMemoListComponent },
            { path: 'create', component: DebitMemoCreateComponent },
            { path: 'edit/:id', component: DebitMemoEditComponent },
            { path: 'view/:id', component: DebitMemoViewComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FinancialRoutingModule { }
