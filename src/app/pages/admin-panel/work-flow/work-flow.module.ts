import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgDragDropModule } from 'ng-drag-drop';

import { WorkFlowComponent } from './work-flow.component';
import { WorkFlowEditComponent } from './work-flow.edit.component';
import { DocumentModalContent } from './modal/document.modal';


import { CommonShareModule } from '../../../shared/index';
import { TableService } from '../../../services/index';
import { AdminPanelService } from '../admin-panel.service';

@NgModule({
    imports: [
        CommonModule,
        CommonShareModule,
        NgDragDropModule.forRoot()
    ],
    declarations: [
        WorkFlowComponent,
        WorkFlowEditComponent,
        DocumentModalContent
    ],
    entryComponents: [DocumentModalContent],
    providers: [TableService]
})
export class WorkFlowModule { }
