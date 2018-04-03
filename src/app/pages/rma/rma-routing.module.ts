import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {RmaComponent} from './rma.component';
import { RmaCreateComponent } from './rma.create.component';
import { RmaEditComponent } from './rma.edit.component';


const routes: Routes = [
    {
        path:'', component:RmaComponent          
    },
    {
        path:'create',component:RmaCreateComponent,
    },
    {
        path:'edit/:id',component:RmaEditComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RmaRoutingModule { }
