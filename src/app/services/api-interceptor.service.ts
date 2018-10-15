// tslint:disable-next-line:ordered-imports
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class ApiInterceptorService {

  constructor(private injector: Injector, private router: Router, private toastr: ToastrService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
      }
    }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          //  redirect to the login route
          window.location.href = `${environment.nab_url}/#/login`;
        } else {
          try {
            if (err.status === 424 && err.url.includes('quick-books/sync-account?force=true')) { // This is for sync Ledger Account to Quickbooks
                const firstFailedAccount = err.error.data.find(account => account.success === false);
                if (firstFailedAccount !== undefined) {
                    this.toastr.error(`Cannot sync Ledger Account "${firstFailedAccount.entity.Name}" to Quickbooks.`);
                }
            } else {
                this.toastr.error(err.error.message);
            }
          } catch (e) { }
        }
      }
    });
  }
}
