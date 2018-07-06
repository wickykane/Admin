import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageHeaderModule } from '../../shared';

import { InvoiceComponent } from './ar-invoice/invoice.component';
import { FinancialRoutingModule } from './financial-routing.module';
import { FinancialService } from './financial.service';
import { PaymentComponent } from './payment/payment.component';



@NgModule({
    imports: [
        CommonModule,
        PageHeaderModule,
        FinancialRoutingModule,
        NgbModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        ChartsModule
    ],
    declarations: [
        InvoiceComponent,
        PaymentComponent

    ],
    providers: [FinancialService],
    entryComponents: []
})
export class FinancialModule { }
