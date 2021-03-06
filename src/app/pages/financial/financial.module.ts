import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';


import { InvoiceCreateComponent } from './ar-invoice/create/invoice.create.component';
import { InvoiceComponent } from './ar-invoice/invoice.component';
import { PODModalComponent } from './ar-invoice/modals/POD/pod.modal';
import { InvoiceDetailComponent } from './ar-invoice/view/invoice.view.component';


//  Saleorder Tab
import { TableService } from '../../services/index';
import { CommonShareModule, Helper, PageHeaderModule } from '../../shared/index';
import { InvoiceEditComponent } from './ar-invoice/edit/invoice.edit.component';
import { InvoiceCreditMemoTabComponent } from './ar-invoice/invoice-tabs/credit-memo-tab.component';
import { InvoiceDebitMemoTabComponent } from './ar-invoice/invoice-tabs/debit-memo-tab.component';
import { InvoiceReceiptVoucherTabComponent } from './ar-invoice/invoice-tabs/receipt-voucher-tab.component';

import { InvoiceDocumentTabComponent } from './ar-invoice/invoice-tabs/document-tab.component';
import { InvoiceInformationTabComponent } from './ar-invoice/invoice-tabs/information-tab.component';
import { InvoicePaymentTabComponent } from './ar-invoice/invoice-tabs/payment-tab.component';
import { InvoiceHistoryTabComponent } from './ar-invoice/invoice-tabs/invoice-history.component';
import { FinancialRoutingModule } from './financial-routing.module';
import { FinancialService } from './financial.service';

import { CreditMemoCreateComponent } from './credit-memo//create/credit-memo-create.component';
import { CreditMemoListComponent } from './credit-memo//list/credit-memo-list.component';
import { CreditMemoApplyComponent } from './credit-memo/apply-credit/apply-credit.component';
import { CreditMemoService } from './credit-memo/credit-memo.service';
import { CreditInformationTabComponent } from './credit-memo/credit-tabs/information-tab.component';
import { CreditHistoryTabComponent } from './credit-memo/credit-tabs/credit-history.component';
import { CreditPaymentTabComponent } from './credit-memo/credit-tabs/payment-tab.component';
import { CreditMemoEditComponent } from './credit-memo/edit/credit-memo-edit.component';
import { CreditItemMiscModalContent } from './credit-memo/modals/item-misc/item-misc.modal';
import { CreditItemModalContent } from './credit-memo/modals/item/item.modal';
import { CreditMailModalComponent } from './credit-memo/modals/send-email/mail.modal';
import { CreditMemoDetailComponent } from './credit-memo/view/credit-memo-view.component';

import { DebitMemoCreateComponent } from './debit-memo/create/debit-memo-create.component';
import { DebitMemoService } from './debit-memo/debit-memo.service';
import { DebitMemoEditComponent } from './debit-memo/edit/debit-memo-edit.component';

import { DebitMemoListComponent } from './debit-memo/list/debit-memo-list.component';
import { DebitHistoryTabComponent } from './debit-memo/tabs/debit-history.component';
import { ItemsOrderDebitModalContent } from './debit-memo/modals/items-order/items-order.modal';
import { MiscItemsDebitModalContent } from './debit-memo/modals/misc-items/misc-items.modal';
import { SendMailDebitModalContent } from './debit-memo/modals/send-email/send-mail.modal';
import { DebitInformationTabComponent } from './debit-memo/tabs/debit-information/debit-information-tab.component';
import { ReceiptVoucherTabComponent } from './debit-memo/tabs/receipt-voucher/receipt-voucher-tab.component';
import { DebitMemoViewComponent } from './debit-memo/view/debit-memo-view.component';

// Receipt Voucher
import { ReceiptVoucherCreateComponent } from './receipt-voucher/create/receipt-voucher.create.component';
import { ReceiptVoucherEditComponent } from './receipt-voucher/edit/receipt-voucher.edit.component';
import { ReceiptMailModalComponent } from './receipt-voucher/modals/mail.modal';
import { PaymentGatewayModalComponent } from './receipt-voucher/modals/payment-gateway/payment-gateway.modal';
import { PaymentInformModalComponent } from './receipt-voucher/modals/payment-inform/payment-inform.modal';
import { ReceiptDocumentTabComponent } from './receipt-voucher/receipt-tabs/document-tab.component';
import { ReceiptInformationTabComponent } from './receipt-voucher/receipt-tabs/information-tab.component';
import { ReceiptVoucherComponent } from './receipt-voucher/receipt-voucher.component';
import { ReceiptHistoryTabComponent } from './receipt-voucher/receipt-tabs/receipt-history.component';
import { ReceiptVoucherDetailComponent } from './receipt-voucher/view/receipt-voucher.view.component';


import { CKEditorModule } from 'ng2-ckeditor';

//  Modal
import { ItemModalModule } from '../../shared/modals/item.module';
import { MailModalComponent } from './ar-invoice/modals/mail.modal';





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
        InvoiceHistoryTabComponent,
        InvoiceDocumentTabComponent,
        MailModalComponent,
        DebitMemoListComponent,
        DebitMemoCreateComponent,
        SendMailDebitModalContent,
        ItemsOrderDebitModalContent,
        MiscItemsDebitModalContent,
        DebitMemoEditComponent,
        DebitMemoViewComponent,
        DebitInformationTabComponent,
        DebitHistoryTabComponent,
        InvoiceEditComponent,
        CreditMemoListComponent,
        CreditMemoCreateComponent,
        CreditInformationTabComponent,
        CreditHistoryTabComponent,
        CreditMemoDetailComponent,
        CreditPaymentTabComponent,
        CreditItemModalContent,
        CreditItemMiscModalContent,
        CreditMemoEditComponent,
        CreditMailModalComponent,
        CreditMemoApplyComponent,
        ReceiptVoucherCreateComponent,
        ReceiptVoucherEditComponent,
        ReceiptVoucherComponent,
        ReceiptHistoryTabComponent,
        ReceiptVoucherDetailComponent,
        ReceiptMailModalComponent,
        ReceiptDocumentTabComponent,
        ReceiptInformationTabComponent,
        PaymentGatewayModalComponent,
        PaymentInformModalComponent,
        PODModalComponent,
        InvoiceReceiptVoucherTabComponent,
        ReceiptVoucherTabComponent
    ],
    providers: [FinancialService, DebitMemoService, CreditMemoService, TableService, DatePipe, Helper],
    entryComponents: [
        SendMailDebitModalContent,
        ItemsOrderDebitModalContent,
        MiscItemsDebitModalContent,
        DebitInformationTabComponent,
        MailModalComponent,
        CreditItemModalContent,
        CreditItemMiscModalContent,
        CreditMailModalComponent,
        PaymentGatewayModalComponent,
        PaymentInformModalComponent,
        PODModalComponent
    ]
})
export class FinancialModule { }
