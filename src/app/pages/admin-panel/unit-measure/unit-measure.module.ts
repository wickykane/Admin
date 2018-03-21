import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { UnitMeasureComponent } from './unit-measure.component';

import { StatModule } from '../../../shared/index';

@NgModule({
    imports: [
        CommonModule,
        NgbAlertModule.forRoot(),
        StatModule
    ],
    declarations: [
        UnitMeasureComponent
    ]
})
export class UnitMeasureModule {}
