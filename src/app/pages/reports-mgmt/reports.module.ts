import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';

import { CommonService, TableService } from '../../services/index';
import { CommonShareModule, Helper, PageHeaderModule } from '../../shared/index';
import { ReportsRoutingModule } from './reports-routing.module';

import { CKEditorModule } from 'ng2-ckeditor';

import { ReportFinanceListComponent } from './finance/list/list.component';
import { CustomerOutstandingComponent } from './finance/reports/customer-outstanding/customer-outstanding.component';

//  Modal
import { ItemModalModule } from '../../shared/modals/item.module';
import { SendMailModalContent } from './finance/modals/send-mail/send-mail.modal';

@NgModule({
    imports: [
        CommonShareModule,
        CommonModule,
        PageHeaderModule,
        ReportsRoutingModule,
        NgbModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        ChartsModule,
        ItemModalModule,
        CKEditorModule,
    ],
    declarations: [
        CustomerOutstandingComponent,
        ReportFinanceListComponent,
        SendMailModalContent
    ],
    providers: [TableService, DatePipe, Helper, CommonService],
    entryComponents: [
        SendMailModalContent
    ]
})
export class ReportsModule { }
