import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysService } from 'angular2-hotkeys';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';
import { OrderService } from '../../../order-mgmt/order-mgmt.service';
import { SaleQuoteDetailKeyService } from '../view/keys.detail.control';
import { TableService } from './../../../../services/table.service';
import { SaleQuotationDetailComponent } from './../view/sale-quotation.detail.component';


@Component({
    selector: 'app-quote-info-tab',
    templateUrl: './information-tab.component.html',
    styleUrls: ['./quote-tab.component.scss'],
    providers: [OrderService]
})
export class QuoteInformationTabComponent implements OnInit {

    /**
     * letiable Declaration
     */

    public _orderId;
    public _orderDetail;
    public order_info = {};
    public data = {};

    public messageConfig = {
        'SM': 'Are you sure that you want to Submit this quotation to approver?',
        'CC': 'Are you sure that you want to cancel this quotation?',
        'CLONE': 'Are you sure that you want to copy this quote?',
        'AM': 'Are you sure that you want to approve this quotation?',
        'RM': 'Are you sure that you want to reject this quotation?',
        'SC': 'Are you sure that you want to convert this quotation to SO?',
    };

    @Input() set orderId(id) {
        if (id) {
            this._orderId = id;
        }
    }

    @Input() set orderDetail(obj) {
        this._orderDetail = obj;
    }

    @Output() stockValueChange = new EventEmitter();

    public detail = {
        'contact_user': {},
        'billing': {},
        'shipping_address': {},
        'items': [],
    };

    constructor(
        public toastr: ToastrService,
        public fb: FormBuilder,
        private vRef: ViewContainerRef,
        private router: Router,
        private modalService: NgbModal,
        public tableService: TableService,
        private orderService: OrderService,
        public keyService: SaleQuoteDetailKeyService,
        private _hotkeysService: HotkeysService,
        @Inject(SaleQuotationDetailComponent) private parent: SaleQuotationDetailComponent,
    ) {
        //  Init Key
        if (!this.parent.data['shortcut']) {
            this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
        }
    }

    ngOnInit() {
        this.getList();
        this.order_info['taxs'] = [];
        this.data['tab'] = {
            active: 0,
        };
        this.changeShortcut();
    }

    /**
     * Internal Function
     */
    changeShortcut() {
        setTimeout(() => {
            this.parent.data['shortcut'] = this.keyService.getKeys();
        });
    }

    getList() {
        this.orderService.getSaleQuoteDetail(this._orderId).subscribe(res => {
            try {
                this.detail = res.data;
                this.detail.contact_user = res.data.contact_user || [];
                this.detail.shipping_address = res.data.shipping_id || [];
                this.detail.billing = res.data.billing_id || [];
                this.stockValueChange.emit(res.data);
                this.order_info['taxs'] = [];
                this.order_info['taxs'] = this.detail['tax_info'];

            } catch (e) {
                console.log(e);
            }
        });
    }

    updateStatus(id, status) {
        const params = { status };
        this.orderService.updateSaleQuoteStatus(id, params).subscribe(res => {
            try {
                this.toastr.success(res.message);
                this.getList();
            } catch (e) {
                console.log(e);
            }
        });
    }

    confirmModal(id, status) {
        const modalRef = this.modalService.open(ConfirmModalContent, { size: 'lg', windowClass: 'modal-md' });
        modalRef.result.then(res => {
            if (res) {
                if (status === 'CLONE') {
                    this.cloneQuote(id);
                    return;
                }
                this.updateStatus(id, status);
            }
        }, dismiss => { });
        modalRef.componentInstance.message = this.messageConfig[status];
        modalRef.componentInstance.yesButtonText = 'Yes';
        modalRef.componentInstance.noButtonText = 'No';
    }

    cloneQuote(id) {
        this.router.navigate(['/order-management/sale-quotation/create'], { queryParams: { is_copy: 1, quote_id: id } });
    }

    goBack() {
        this.router.navigate(['/order-management/sale-quotation']);
    }

    changeTab(step) {
        this.data['tab'].active = +this.parent.tabSet.activeId;
        this.data['tab'].active += step;
        this.data['tab'].active = Math.min(Math.max(this.data['tab'].active, 0), 7);
        this.parent.selectTab(String(this.data['tab'].active));
    }
}
