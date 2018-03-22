import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cdArrowTable, SortColumnDirective } from '../../directives/index';

@NgModule({
    imports: [CommonModule],
    declarations: [cdArrowTable, SortColumnDirective],
    exports: [cdArrowTable, SortColumnDirective]
})

export class CommonShareModule {}
