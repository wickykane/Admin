import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';


import { InvoiceComponent } from './ar-invoice/invoice.component';
import { InvoiceCreateComponent } from './ar-invoice/invoice.create.component';
import { InvoiceDetailComponent } from './ar-invoice/invoice.view.component';

import { TableService } from '../../services/index';
import { CommonShareModule, Helper,  PageHeaderModule } from '../../shared/index';
import { FinancialRoutingModule } from './financial-routing.module';
import { FinancialService } from './financial.service';

@NgModule({
    imports: [
        CommonShareModule,
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
        InvoiceCreateComponent,
        InvoiceDetailComponent,

    ],
    providers: [FinancialService, TableService, DatePipe, Helper],
    entryComponents: []
})
export class FinancialModule { }
