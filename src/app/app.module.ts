import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HotkeyModule} from 'angular2-hotkeys';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomSpinnerComponent } from './shared/modules/custom-spinner/spinner.component';

import { AuthGuard, JwtService } from './shared';
import { AuthenticationService, ApiService, ApiInterceptorService } from './services/index';
import { NgHttpLoaderModule } from 'ng-http-loader/ng-http-loader.module';
import 'angular2-navigate-with-data';


// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
    // for development
    // return new TranslateHttpLoader(http, '/start-angular/SB-Admin-BS4-Angular-5/master/dist/assets/i18n/', '.json');
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
        ToastModule.forRoot(),
        ToastrModule.forRoot(),
        HotkeyModule.forRoot()
    ],
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
