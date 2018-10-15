import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';
import { BackdropModalContent } from '../../../../shared/modals/backdrop.modal';
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
        'SB': 'Are you sure that you want to submit this order to approver?',
        'CC': 'Are you sure that you want to cancel this return order?',
        'AP': 'Are you sure that you want to approve and send this return order to warehouse?',
        'RJ': 'Are you sure that you want to reject current order?',
        'RC': 'Are you sure that you want to revise this return order?',
        'CP': 'Are you sure that you want to complete this return order?'
    };
    public selected_message = '';

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

                if (!this.detail['is_change']) {
                  this.checkStatusOrder();
                }


            } catch (e) {
                console.log(e);
            }
        });
    }

    checkStatusOrder() {
      const modalRef = this.modalService.open(BackdropModalContent, { size: 'lg', windowClass: 'modal-md', backdrop: 'static', keyboard: false });
      modalRef.result.then( res => {
          if (res) {
              console.log(res);
          }
      }, dismiss => { });
      modalRef.componentInstance.message = 'There are changes of the sales order. The system will refresh for up to date.';
      modalRef.componentInstance.yesButtonText = 'OK';
    }

    backList() {
        this.router.navigate(['/order-management/return-order']);
    }


    confirmModal(id, status, status_item) {
        const modalRef = this.modalService.open(ConfirmModalContent, { size: 'lg', windowClass: 'modal-md' });
        modalRef.result.then(res => {
            if (res) {
                if (status !== 7) {
                    this.updateStatus(id, status);
                } else {
                    this.completeStatus(id);
                }
            }
        }, dismiss => { });
        switch (status) {
            case 2:
                // cancel
                this.selected_message = this.messageConfig.CC;
                break;
            case 3:
                this.selected_message = this.messageConfig.SB;
                break;
            case 5:
                this.selected_message = this.messageConfig.AP;
                break;
            case 7:
                this.selected_message = this.messageConfig.CP;
                break;
        }
        modalRef.componentInstance.message = this.selected_message;
        modalRef.componentInstance.yesButtonText = 'Yes';
        modalRef.componentInstance.noButtonText = 'No';
    }

    completeStatus(id) {
        this.service.completeStatus(id).subscribe(res => {
            try {
                this.toastr.success(res.message);
                this.router.navigate(['/order-management/return-order']);
            } catch (e) {
                console.log(e);
            }
        });
    }

    updateStatus(id, status) {
        const params = { return_order_id: id, status_id: status };
        this.service.updateStatus(params).subscribe(res => {
            try {
                this.toastr.success(res.message);
                this.router.navigate(['/order-management/return-order']);
            } catch (e) {
                console.log(e);
            }
        });
    }

    cancel() {
        this.router.navigate(['/order-management/return-order']);
    }

    edit() {

    }
    generateInvoice() {

    }
}
