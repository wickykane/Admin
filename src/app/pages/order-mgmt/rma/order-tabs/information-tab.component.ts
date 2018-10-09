import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';
import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';
import { RMAService } from '../rma.service';
import { TableService } from './../../../../services/table.service';

import { HotkeysService } from 'angular2-hotkeys';
import { RMAViewKeyService } from '../view/keys.control';


@Component({
    selector: 'app-rma-info-tab',
    templateUrl: './information-tab.component.html',
    styleUrls: ['./order-tab.component.scss'],
    providers: [RMAService],
    animations: [routerTransition()],
})
export class ReturnOrderInformationTabComponent implements OnInit {

    /**
     * letiable Declaration
     */

    public _orderId;
    public _orderDetail;
    @Input() set orderId(id) {
        if (id) {
            this._orderId = id;
        }
    }

    @Input() set orderDetail(obj) {
        this._orderDetail = obj;
    }

    @Output() stockValueChange = new EventEmitter();
    public requiredInv = true;


    public detail = {
        'billing': {},
        'shipping': {},
        'subs': []
    };
    public addr_select = {
        shipping: {
            'address_name': '',
            'address_line': '',
            'country_name': '',
            'city_name': '',
            'state_name': '',
            'zip_code': '',
            'name': ''
        },
        billing: {
            'address_name': '',
            'address_line': '',
            'country_name': '',
            'city_name': '',
            'state_name': '',
            'zip_code': '',
            'name': ''
        }
    };

    public list = {
        returnItem: [],
        returnItem_delete: [],
        replaceItem: [],
        replaceItem_delete: []
    };

    public order_info = {
        total: 0,
        order_summary: {},
        sub_total: 0,
    };
    public messageConfig = {
        'SM': 'Are you sure that you want to submit current order ?',
        'CC': 'Are you sure that you want to cancel current order?',
        'CLONE': 'Are you sure that you want to copy current order?',
        'AP': 'Are you sure that you want to approve current order?',
        'RJ': 'Are you sure that you want to reject current order?',
        'RO': 'Are you sure that you want to re-open current order?',
    };

    constructor(
        public fb: FormBuilder,
        public toastr: ToastrService,
        private router: Router,
        private vRef: ViewContainerRef,
        private modalService: NgbModal,
        public tableService: TableService,
        private service: RMAService,
        public keyService: RMAViewKeyService,
        private _hotkeysService: HotkeysService) {
          
          this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
    }

    ngOnInit() {
        this.getList();

    }

    /**
     * Internal Function
     */

    getList() {

        this.service.getDetailRMA(this._orderId).subscribe(res => {
            try {
                this.detail = res.data;
                this.stockValueChange.emit(res.data);

                this.detail.shipping = res.data.shipping_data ? res.data.shipping_data : this.addr_select.shipping;
                this.detail.billing = res.data.billing_data ? res.data.billing_data : this.addr_select.billing;

                this.list.returnItem = res.data.items || [];
                this.list.replaceItem = res.data.items_replace || [];


            } catch (e) {
                console.log(e);
            }
        });
    }

    backList() {
        this.router.navigate(['/order-management/return-order']);
    }


    confirmModal(id, status) {
        const modalRef = this.modalService.open(ConfirmModalContent, { size: 'lg', windowClass: 'modal-md' });
        modalRef.result.then(res => {
            if (res) {
                switch (status) {
                    case 'SM':
                        this.updateStatusOrder(id, 6);
                        break;
                    case 'AP':
                        this.putApproveOrder(id);
                        break;
                    case 'RJ':
                        this.updateStatusOrder(id, 11);
                        break;
                    case 'CC':
                        this.updateStatusOrder(id, 7);
                        break;
                    case 'RO':
                        this.updateStatusOrder(id, 1);
                        break;
                    case 'CLONE':
                        this.cloneNewOrder(id);
                        break;
                }
            }
        }, dismiss => { });
        modalRef.componentInstance.message = this.messageConfig[status];
        modalRef.componentInstance.yesButtonText = 'Yes';
        modalRef.componentInstance.noButtonText = 'No';
    }

    cloneNewOrder(id) {

    }

    putApproveOrder(order_id) {

    }

    updateStatusOrder(order_id, status) {

    }

    cancel() {
        this.router.navigate(['/order-management/return-order']);
    }

    edit() {

    }
    generateInvoice() {

    }
}
