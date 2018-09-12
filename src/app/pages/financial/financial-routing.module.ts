import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InvoiceCreateComponent } from './ar-invoice/create/invoice.create.component';
import { InvoiceEditComponent } from './ar-invoice/edit/invoice.edit.component';
import { InvoiceComponent } from './ar-invoice/invoice.component';
import { InvoiceDetailComponent } from './ar-invoice/view/invoice.view.component';

import { CreditMemoApplyComponent } from './credit-memo/apply-credit/apply-credit.component';
import { CreditMemoCreateComponent } from './credit-memo/create/credit-memo-create.component';
import { CreditMemoEditComponent} from './credit-memo/edit/credit-memo-edit.component';
import { CreditMemoListComponent } from './credit-memo/list/credit-memo-list.component';
import { CreditMemoDetailComponent } from './credit-memo/view/credit-memo-view.component';

import { DebitMemoCreateComponent } from './debit-memo/create/debit-memo-create.component';
import { DebitMemoEditComponent } from './debit-memo/edit/debit-memo-edit.component';
import { DebitMemoListComponent } from './debit-memo/list/debit-memo-list.component';
import { DebitMemoViewComponent } from './debit-memo/view/debit-memo-view.component';

// Receipt Voucher
import {ReceiptVoucherCreateComponent} from './receipt-voucher/create/receipt-voucher.create.component';
import {ReceiptVoucherEditComponent} from './receipt-voucher/edit/receipt-voucher.edit.component';
import {ReceiptVoucherComponent} from './receipt-voucher/receipt-voucher.component';
import {ReceiptVoucherDetailComponent} from './receipt-voucher/view/receipt-voucher.view.component';

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
        path: 'receipt-voucher',
        children: [
            { path: '', component: ReceiptVoucherComponent },
            { path: 'create', component: ReceiptVoucherCreateComponent },
            { path: 'view/:id', component: ReceiptVoucherDetailComponent },
            { path: 'edit/:id', component: ReceiptVoucherEditComponent }
        ]
    },
    {
        path: 'credit-memo',
        children: [
            { path: '', component: CreditMemoListComponent },
            { path: 'create', component: CreditMemoCreateComponent },
            { path: 'edit/:id', component: CreditMemoEditComponent },
            { path: 'view/:id', component: CreditMemoDetailComponent },
            { path: 'apply-credit/:id', component: CreditMemoApplyComponent}
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
