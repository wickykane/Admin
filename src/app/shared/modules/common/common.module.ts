import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';
import { cdArrowTable, ClickOutsideDirective, KeyNavigateDirective, NgStickyDirective, NumberDirective, OnlyNumber, PatternDirective, SortColumnDirective, TrimDirective, TrueFalseValueDirective, UppercaseDirective } from '../../directives/index';
import { NgbUTCStringAdapter } from './datepickerConfig';

import { DateObjectPipe, ReturnFilterPipe, Select2Pipe } from '../../pipes/index';
import { ShortcutComponent } from '../short-cut/shortcut.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgbDateCustomParserFormatter } from '../../helper/dateformat';

import { HotkeyModule } from 'angular2-hotkeys';

import { VirtualScrollerModule } from 'ngx-virtual-scroller';

@NgModule({
    imports: [VirtualScrollerModule, HotkeyModule.forRoot(), CommonModule, FormsModule, ReactiveFormsModule, NgbModule.forRoot(), TextMaskModule, NgSelectModule],
    declarations: [PatternDirective, TrimDirective, KeyNavigateDirective, cdArrowTable, OnlyNumber, SortColumnDirective, UppercaseDirective, TrueFalseValueDirective,
        DateObjectPipe, ReturnFilterPipe, Select2Pipe, ShortcutComponent, NgStickyDirective, ClickOutsideDirective, NumberDirective],
    exports: [VirtualScrollerModule, HotkeyModule, PatternDirective, TrimDirective, NumberDirective, KeyNavigateDirective, cdArrowTable, OnlyNumber, SortColumnDirective, UppercaseDirective, DateObjectPipe, ReturnFilterPipe, TrueFalseValueDirective,
        FormsModule, ReactiveFormsModule, NgbModule, TextMaskModule, NgSelectModule, ShortcutComponent, NgStickyDirective, ClickOutsideDirective],
    providers: [{ provide: NgbDateAdapter, useClass: NgbUTCStringAdapter }, { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }]
})

export class CommonShareModule { }
