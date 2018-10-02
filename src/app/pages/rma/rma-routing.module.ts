import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RmaCreateComponent } from './create/rma.create.component';
import { RmaEditComponent } from './edit/rma.edit.component';
import { RmaComponent } from './list/rma.component';
import { RmaDetailComponent } from './view/rma.view.component';


const routes: Routes = [
    {
        path: '', component: RmaComponent
    },
    {
        path: 'create', component: RmaCreateComponent,
    },
    {
        path: 'edit/:id', component: RmaEditComponent,
    },
    {
        path: 'detail/:id', component: RmaDetailComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RmaRoutingModule { }
