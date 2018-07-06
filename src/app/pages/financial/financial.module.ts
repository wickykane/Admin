import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageHeaderModule } from '../../shared';

import { InvoiceComponent } from './ar-invoice/invoice.component';
import { FinancialRoutingModule } from './financial-routing.module';
import { FinancialService } from './financial.service';



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

    ],
    providers: [FinancialService],
    entryComponents: []
})
export class FinancialModule { }
