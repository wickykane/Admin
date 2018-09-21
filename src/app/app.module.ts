import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomSpinnerComponent } from './shared/modules/custom-spinner/spinner.component';

import 'angular2-navigate-with-data';
// tslint:disable-next-line:ordered-imports
import { NgHttpLoaderModule } from 'ng-http-loader/ng-http-loader.module';
// tslint:disable-next-line:ordered-imports
import { ApiInterceptorService, ApiService, AuthenticationService } from './services/index';
import { AuthGuard, JwtService } from './shared';


//  AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
    //  for development
    //  return new TranslateHttpLoader(http, '/start-angular/SB-Admin-BS4-Angular-5/master/dist/assets/i18n/', '.json');
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        NgHttpLoaderModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            }
        }),
        AppRoutingModule,
        NgbModule.forRoot(),
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule.forRoot({ enableHtml: true }),
    ],
    entryComponents: [CustomSpinnerComponent],
    declarations: [
        AppComponent,
        CustomSpinnerComponent,

    ],
    providers: [
        AuthGuard,
        JwtService,
        AuthenticationService,
        ApiService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiInterceptorService,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
