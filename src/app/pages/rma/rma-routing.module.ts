import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {RmaComponent} from './rma.component';

const routes: Routes = [
    {
        path:'', component:RmaComponent
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RmaRoutingModule { }
