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

    public completeStatusConfig = {
        'type1_complete': 'has already been shipped to customer. The system will create a credit memo based on the returned items once the return process completed. Do you want to continue?',
        'type1_nocomplete_no_invoice': 'Are you sure that you want to complete the return order?',
        'type1_nocomplete_invoice_1': 'has an open invoiced. The system will cancel it for you to create manually a new one from the updated sales order once the return process completed. Do you want to continue?',
        'type1_nocomplete_invoice_2': ' has a paid invoiced. The system will create a credit memo based on the returned items. Do you want to continue?',
        'type2': 'After completing the return process, the system will create a replacement sales order for you. Do you want to continue?',
        'type3': 'After completing the return process, the system will create a replacement sales order for you. Do you want to continue?',
        'type4': 'has already been shipped to customer. The system will create a credit memo based on the returned items once the return process completed. Do you want to continue?'
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

                if (this.detail['is_change']) {
                    this.checkStatusOrder(this.detail['id']);
                }


            } catch (e) {
                console.log(e);
            }
        });
    }

    checkStatusOrder(id) {
        const modalRef = this.modalService.open(BackdropModalContent, { size: 'lg', windowClass: 'modal-md', backdrop: 'static', keyboard: false });
        modalRef.result.then(res => {
            if (res) {
                this.service.updateChange(id).subscribe(result => {
                    try {
                        this.toastr.success('The system is refreshed successfully');
                        this.router.navigate(['/order-management/return-order/detail', id]);
                    } catch (e) {
                        console.log(e);
                    }
                });
            }
        }, dismiss => { });
        modalRef.componentInstance.message = 'There are changes of the sales order. The system will refresh for up to date.';
        modalRef.componentInstance.yesButtonText = 'OK';
    }

    backList() {
        this.router.navigate(['/order-management/return-order']);
    }


    confirmModal(item, status, status_item) {
        const modalRef = this.modalService.open(ConfirmModalContent, { size: 'lg', windowClass: 'modal-md' });
        modalRef.result.then(res => {
            if (res) {
                if (status !== 7) {
                    this.updateStatus(item, status);
                } else {
                    this.completeStatus(item);
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
        }
        modalRef.componentInstance.message = this.selected_message;
        modalRef.componentInstance.yesButtonText = 'Yes';
        modalRef.componentInstance.noButtonText = 'No';
    }

    completeStatus(item) {
        // truyen return_type_id , order_id cua row
        // kiem tra return_type_id
        // neu = 1 thi href qua credit memo view theo data reponse
        // neu = 3 thi href qua sale order view theo data reponse
        // neu = 2 hoac 4 thi href qua sale order view theo order id
        let message = '';
        switch (item.return_type_id) {
            case 1:
                // Return
                if (item.order_status_id === 4) {
                    message = this.completeStatusConfig['type1_complete'];
                } else {
                    if (item.invoice_id) {
                        if (item.invoice_status_id === 1 || item.invoice_status_id === 4) {
                            message = this.completeStatusConfig['type1_nocomplete_invoice_1'];
                        }
                        if (item.invoice_status_id === 5 || item.invoice_status_id === 6) {
                            message = this.completeStatusConfig['type1_nocomplete_invoice_2'];
                        }
                    } else {
                        message = this.completeStatusConfig['type1_nocomplete_no_invoice'];
                    }
                }

                if (message) {
                }
                break;
            case 2:
                // Replace same items
                message = this.completeStatusConfig['type2'];
                if (message) {
                }
                break;
            case 3:
                // Replace different items
                message = this.completeStatusConfig['type3'];
                if (message) {
                }
                break;
            case 4:
                // Repair
                message = this.completeStatusConfig['type4'];
                break;
        }

        if (message) {
          this.messageForCompleteStatus(item, message);
        }
    }

    messageForCompleteStatus(item, message) {
        const modalRef = this.modalService.open(ConfirmModalContent, { size: 'lg', windowClass: 'modal-md' });
        modalRef.result.then(res => {
            if (res) {
                this.service.completeStatus(item.id).subscribe(result => {
                    try {
                        this.toastr.success(res.message);
                        if (item.return_type_id === 1 && (item.invoice_status_id === 5 || item.invoice_status_id === 6)) {
                            setTimeout(() => {
                                this.router.navigate(['/financial/credit-memo/view/' + result.credit_id]);
                            }, 500);
                        }

                        if (item.return_type_id === 4) {
                          setTimeout(() => {
                              this.router.navigate(['/order-management/sale-order/detail', item.order_id]);
                          }, 500);
                        } else {
                            setTimeout(() => {
                                this.router.navigate(['/order-management/sale-order/detail', result.order_id]);
                            }, 500);
                        }
                    } catch (e) {
                        console.log(e);
                    }
                });
            }
        }, dismiss => { });
        modalRef.componentInstance.message = message;
        modalRef.componentInstance.yesButtonText = 'Yes';
        modalRef.componentInstance.noButtonText = 'No';
    }

    updateStatus(item, status) {
        const params = { return_order_id: item.id, status_id: status };
        this.service.updateStatus(params).subscribe(res => {
            try {
                if (status === 5) {
                    if (!res.status && res.message === 'show popup') {
                        this.cancelOrder(item);
                    }
                } else {
                    this.toastr.success(res.message);
                    this.router.navigate(['/order-management/return-order']);
                }
            } catch (e) {
                console.log(e);
            }
        });
    }

    cancelOrder(item) {
        const modalRef = this.modalService.open(BackdropModalContent, { size: 'lg', windowClass: 'modal-md', backdrop: 'static', keyboard: false });
        modalRef.result.then(res => {
            if (res) {
                this.service.updateChange(item.id).subscribe(result => {
                    try {
                        this.confirmModal(item.id, 2, '');
                    } catch (e) {
                        console.log(e);
                    }
                });
            }
        }, dismiss => { });
        modalRef.componentInstance.message = 'The sales order status is delivering. The return order will be canceled now. You can create the return until the goods delivered to customer.';
        modalRef.componentInstance.yesButtonText = 'OK';
    }

    cancel() {
        this.router.navigate(['/order-management/return-order']);
    }

    edit() {

    }
    generateInvoice() {

    }
}
