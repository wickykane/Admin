import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';
import { ReceiptVoucherService } from '../receipt-voucher.service';
import { ReceiptDetailKeyService } from './keys.view.control';


@Component({
    selector: 'app-invoice-receipt-voucher',
    templateUrl: './receipt-voucher.view.component.html',
    styleUrls: ['../receipt-voucher.component.scss'],
    animations: [routerTransition()],
    providers: [HotkeysService, ReceiptDetailKeyService, ReceiptVoucherService]
})

export class ReceiptVoucherDetailComponent implements OnInit {
    /**
     * Variable Declaration
     */

    public data = {};
    public receiptId;


    /**
     * Init Data
     */
    @ViewChild('tabSet') tabSet;
    constructor(public sanitizer: DomSanitizer,
        private modalService: NgbModal,
        public toastr: ToastrService,
        private router: Router,
        private receiptVoucherService: ReceiptVoucherService,
        public keyService: ReceiptDetailKeyService,
        private _hotkeysService: HotkeysService,
        private route: ActivatedRoute) {
        //  Init Key
        // this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
    }

    ngOnInit() {
        this.data['id'] = this.route.snapshot.paramMap.get('id');
        this.receiptId = this.data['id'];
    }
    /**
     * Mater Data
     */

    back() {
        this.router.navigate(['/financial/receipt-voucher/']);
    }
    selectTab(id) {
        this.tabSet.select(id);
    }
}
