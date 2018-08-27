import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';


import { InvoiceComponent } from './ar-invoice/invoice.component';
import { InvoiceCreateComponent } from './ar-invoice/invoice.create.component';
import { InvoiceDetailComponent } from './ar-invoice/invoice.view.component';

//  Saleorder Tab
import { InvoiceCreditMemoTabComponent } from './ar-invoice/invoice-tabs/credit-memo-tab.component';
import { InvoiceDebitMemoTabComponent } from './ar-invoice/invoice-tabs/debit-memo-tab.component';
import { InvoiceDocumentTabComponent } from './ar-invoice/invoice-tabs/document-tab.component';
import { InvoiceInformationTabComponent } from './ar-invoice/invoice-tabs/information-tab.component';
import { InvoicePaymentTabComponent } from './ar-invoice/invoice-tabs/payment-tab.component';

import { TableService } from '../../services/index';
import { CommonShareModule, Helper, PageHeaderModule } from '../../shared/index';
import { FinancialRoutingModule } from './financial-routing.module';
import { FinancialService } from './financial.service';
import { PaymentComponent } from './payment/payment.component';

import { DebitMemoCreateComponent } from './debit-memo/create/debit-memo-create.component';
import { DebitMemoService } from './debit-memo/debit-memo.service';
import { DebitMemoListComponent } from './debit-memo/list/debit-memo-list.component';
import { ItemsOrderDebitModalContent } from './debit-memo/modals/items-order/items-order.modal';
import { MiscItemsDebitModalContent } from './debit-memo/modals/misc-items/misc-items.modal';
import { SendMailDebitModalContent } from './debit-memo/modals/send-email/send-mail.modal';


import { CKEditorModule } from 'ng2-ckeditor';

//  Modal
import { ItemModalModule } from '../../shared/modals/item.module';

@NgModule({
    imports: [
        CommonShareModule,
        CommonModule,
        PageHeaderModule,
        FinancialRoutingModule,
        NgbModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        ChartsModule,
        ItemModalModule,
        CKEditorModule
    ],
    declarations: [
        InvoiceComponent,
        InvoiceCreateComponent,
        InvoiceDetailComponent,
        InvoiceInformationTabComponent,
        InvoiceCreditMemoTabComponent,
        InvoiceDebitMemoTabComponent,
        InvoicePaymentTabComponent,
        InvoiceDocumentTabComponent,
        PaymentComponent,
        DebitMemoListComponent,
        DebitMemoCreateComponent,
        SendMailDebitModalContent,
        ItemsOrderDebitModalContent,
        MiscItemsDebitModalContent
    ],
    providers: [FinancialService, DebitMemoService, TableService, DatePipe, Helper],
    entryComponents: [
        SendMailDebitModalContent,
        ItemsOrderDebitModalContent,
        MiscItemsDebitModalContent
    ]
})
export class FinancialModule { }
