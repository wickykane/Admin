import { NgModule } from '@angular/core';
import { NgbModule, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { cdArrowTable, SortColumnDirective, UppercaseDirective, TrueFalseValueDirective, NgStickyDirective, ClickOutsideDirective, NumericDirective } from '../../directives/index';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbUTCStringAdapter } from './datepickerConfig';
import { TextMaskModule } from 'angular2-text-mask';

import { DateObjectPipe, Select2Pipe } from '../../pipes/index';
import { ShortcutComponent } from '../short-cut/shortcut.component';

import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbModule.forRoot(), TextMaskModule, NgSelectModule],
    declarations: [cdArrowTable, SortColumnDirective, UppercaseDirective, TrueFalseValueDirective,
        DateObjectPipe, Select2Pipe, ShortcutComponent, NgStickyDirective, ClickOutsideDirective, NumericDirective],
    exports: [cdArrowTable, SortColumnDirective, UppercaseDirective, DateObjectPipe, TrueFalseValueDirective,
        FormsModule, ReactiveFormsModule, NgbModule, TextMaskModule, NgSelectModule, ShortcutComponent, NgStickyDirective, ClickOutsideDirective],
    providers: [{ provide: NgbDateAdapter, useClass: NgbUTCStringAdapter }]
})

export class CommonShareModule { }
