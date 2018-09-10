import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';
import { FinancialService } from '../../financial.service';
import { InvoiceDetailKeyService } from './keys.view.control';


@Component({
    selector: 'app-credit-memo-detail',
    templateUrl: './credit-memo-view.component.html',
    styleUrls: ['../credit-memo.component.scss'],
    animations: [routerTransition()],
    providers: [HotkeysService, InvoiceDetailKeyService]
})

export class CreditMemoDetailComponent implements OnInit {
    /**
     * Variable Declaration
     */

    public data = {};
    public creditId;


    /**
     * Init Data
     */

    constructor(public sanitizer: DomSanitizer,
        private modalService: NgbModal,
        public toastr: ToastrService,
        private router: Router,
        private financialService: FinancialService,
        public keyService: InvoiceDetailKeyService,
        private _hotkeysService: HotkeysService,
        private route: ActivatedRoute) {
        //  Init Key
        this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
    }

    ngOnInit() {
        this.data['id'] = this.route.snapshot.paramMap.get('id');
        this.creditId = this.data['id'];
    }
    /**
     * Mater Data
     */

    back() {
        this.router.navigate(['/financial/credit-memo/']);
    }

}
