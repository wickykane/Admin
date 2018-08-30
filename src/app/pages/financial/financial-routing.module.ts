import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InvoiceCreateComponent } from './ar-invoice/create/invoice.create.component';
import { InvoiceEditComponent } from './ar-invoice/edit/invoice.edit.component';
import { InvoiceComponent } from './ar-invoice/invoice.component';
import { InvoiceDetailComponent } from './ar-invoice/view/invoice.view.component';
import { PaymentComponent } from './payment/payment.component';

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
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FinancialRoutingModule { }
