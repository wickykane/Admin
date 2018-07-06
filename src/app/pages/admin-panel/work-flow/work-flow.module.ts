import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgDragDropModule } from 'ng-drag-drop';

import { DocumentModalContent } from './modal/document.modal';
import { WorkFlowComponent } from './work-flow.component';
import { WorkFlowEditComponent } from './work-flow.edit.component';


import { TableService } from '../../../services/index';
import { CommonShareModule } from '../../../shared/index';
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
