import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WarehourseComponent } from './warehourse/warehourse.component';

const routes: Routes = [
    {
        path: '',
        children: [
            { path: '', component: WarehourseComponent },
            // { path: 'create', component: CustomerSegmentCreateComponent },
            // { path: 'edit/:id', component: CustomerSegmentEditComponent }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WarehouseMgmtRoutingModule {}
