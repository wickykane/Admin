import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';

import { CommonService, TableService } from '../../services/index';
import { CommonShareModule, Helper, PageHeaderModule } from '../../shared/index';
import { ReportsRoutingModule } from './reports-routing.module';

import { CKEditorModule } from 'ng2-ckeditor';

//  Modal
import { ItemModalModule } from '../../shared/modals/item.module';
import { ReportFinanceListComponent } from './finance/list/list.component';

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
        ReportFinanceListComponent,
    ],
    providers: [TableService, DatePipe, Helper, CommonService],
    entryComponents: []
})
export class ReportslModule {}
