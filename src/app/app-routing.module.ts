import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';

const routes: Routes = [
    { path: '', loadChildren: './pages/layout.module#LayoutModule', canActivate: [AuthGuard] },
    // { path: 'login', loadChildren: './pages/login/login.module#LoginModule' },
    // { path: 'signup', loadChildren: './pages/signup/signup.module#SignupModule' },
    // { path: 'error', loadChildren: './server-error/server-error.module#ServerErrorModule' },
    // { path: 'access-denied', loadChildren: './access-denied/access-denied.module#AccessDeniedModule' },
    { path: '404', loadChildren: './pages/404/not-found.module#NotFoundModule' },
    { path: '**', redirectTo: '404' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
