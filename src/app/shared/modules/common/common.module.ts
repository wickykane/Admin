import { NgModule } from '@angular/core';
import { NgbModule, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { cdArrowTable, SortColumnDirective, UppercaseDirective, TrueFalseValueDirective } from '../../directives/index';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbUTCStringAdapter } from './datepickerConfig';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbModule.forRoot(), TextMaskModule],
    declarations: [cdArrowTable, SortColumnDirective, UppercaseDirective, TrueFalseValueDirective],
    exports: [cdArrowTable, SortColumnDirective, UppercaseDirective, TrueFalseValueDirective, FormsModule, ReactiveFormsModule, NgbModule, TextMaskModule],
    providers: [{ provide: NgbDateAdapter, useClass: NgbUTCStringAdapter }]
})

export class CommonShareModule { }
