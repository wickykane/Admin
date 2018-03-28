import { NgModule } from '@angular/core';
import { NgbModule, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { cdArrowTable, SortColumnDirective, UppercaseDirective, TrueFalseValueDirective } from '../../directives/index';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbUTCStringAdapter } from './datepickerConfig';
import { TextMaskModule } from 'angular2-text-mask';

import { DateObjectPipe } from "../../pipes/index";
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbModule.forRoot(), TextMaskModule, NgSelectModule],
    declarations: [cdArrowTable, SortColumnDirective, UppercaseDirective, TrueFalseValueDirective, DateObjectPipe],
    exports: [cdArrowTable, SortColumnDirective, UppercaseDirective, DateObjectPipe, TrueFalseValueDirective, FormsModule, ReactiveFormsModule, NgbModule, TextMaskModule, NgSelectModule],
    providers: [{ provide: NgbDateAdapter, useClass: NgbUTCStringAdapter }]
})

export class CommonShareModule { }
