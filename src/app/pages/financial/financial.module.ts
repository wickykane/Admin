import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';


import { InvoiceComponent } from './ar-invoice/invoice.component';
import { InvoiceCreateComponent } from './ar-invoice/invoice.create.component';
import { InvoiceDetailComponent } from './ar-invoice/invoice.view.component';

//  Saleorder Tab
import { InvoiceInformationTabComponent } from './ar-invoice/invoice-tabs/information-tab.component';
import { InvoiceCreditMemoTabComponent } from './ar-invoice/invoice-tabs/credit-memo-tab.component';
import { InvoiceDebitMemoTabComponent } from './ar-invoice/invoice-tabs/debit-memo-tab.component';
import { InvoicePaymentTabComponent } from './ar-invoice/invoice-tabs/payment-tab.component';
import { InvoiceDocumentTabComponent } from './ar-invoice/invoice-tabs/document-tab.component';

import { TableService } from '../../services/index';
import { CommonShareModule, Helper, PageHeaderModule } from '../../shared/index';
import { FinancialRoutingModule } from './financial-routing.module';
import { FinancialService } from './financial.service';
import { PaymentComponent } from './payment/payment.component';

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
        ItemModalModule
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
        PaymentComponent

    ],
    providers: [FinancialService, TableService, DatePipe, Helper],
    entryComponents: []
})
export class FinancialModule { }
