import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { UnitMeasureComponent } from './unit-measure.component';

import { PageHeaderModule } from '../../../shared';
import { StatModule , CommonShareModule} from '../../../shared/index';
import { TableService } from "../../../services/index";

@NgModule({
    imports: [
        CommonModule,
        NgbAlertModule.forRoot(),
        StatModule,
        PageHeaderModule ,
        CommonShareModule      
    ],
    declarations: [
        UnitMeasureComponent
    ],
    providers: [TableService]
})
export class UnitMeasureModule {}
