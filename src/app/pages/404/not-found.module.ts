import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NotFoundRoutingModule } from './not-found-routing.module';
import { PageNotFoundComponent } from './not-found.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, NotFoundRoutingModule, FormsModule,
        ReactiveFormsModule],
    declarations: [PageNotFoundComponent]
})
export class NotFoundModule { }
