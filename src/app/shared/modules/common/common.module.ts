import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { cdArrowTable, SortColumnDirective } from '../../directives/index';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbModule.forRoot() ],
    declarations: [cdArrowTable, SortColumnDirective],
    exports: [cdArrowTable, SortColumnDirective, FormsModule, ReactiveFormsModule, NgbModule]
})

export class CommonShareModule {}
