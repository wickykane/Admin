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

import { MasterGuard } from '../../shared';

const routes: Routes = [
    {
        path: 'invoice',
        children: [
            { path: '', component: InvoiceComponent, canActivate: [MasterGuard] },
            { path: 'create', component: InvoiceCreateComponent, canActivate: [MasterGuard] },
            { path: 'view/:id', component: InvoiceDetailComponent, canActivate: [MasterGuard] },
            { path: 'edit/:id', component: InvoiceEditComponent, canActivate: [MasterGuard] },
        ]
    },
    {
        path: 'receipt-voucher',
        children: [
            { path: '', component: ReceiptVoucherComponent, canActivate: [MasterGuard] },
            { path: 'create', component: ReceiptVoucherCreateComponent, canActivate: [MasterGuard] },
            { path: 'view/:id', component: ReceiptVoucherDetailComponent, canActivate: [MasterGuard] },
            { path: 'edit/:id', component: ReceiptVoucherEditComponent, canActivate: [MasterGuard] },
        ]
    },
    {
        path: 'credit-memo',
        children: [
            { path: '', component: CreditMemoListComponent, canActivate: [MasterGuard] },
            { path: 'create', component: CreditMemoCreateComponent, canActivate: [MasterGuard] },
            { path: 'edit/:id', component: CreditMemoEditComponent, canActivate: [MasterGuard] },
            { path: 'view/:id', component: CreditMemoDetailComponent, canActivate: [MasterGuard] },
            { path: 'apply-credit/:id', component: CreditMemoApplyComponent, canActivate: [MasterGuard] },
        ]
    },
    {
        path: 'debit-memo',
        children: [
            { path: '', component: DebitMemoListComponent, canActivate: [MasterGuard] },
            { path: 'create', component: DebitMemoCreateComponent, canActivate: [MasterGuard] },
            { path: 'edit/:id', component: DebitMemoEditComponent, canActivate: [MasterGuard] },
            { path: 'view/:id', component: DebitMemoViewComponent, canActivate: [MasterGuard] },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FinancialRoutingModule { }
