import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnitMeasureComponent } from './unit-measure.component';

const routes: Routes = [
    {
        path: '',
        component: UnitMeasureComponent,        
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UnitMeasureRoutingModule {
}
