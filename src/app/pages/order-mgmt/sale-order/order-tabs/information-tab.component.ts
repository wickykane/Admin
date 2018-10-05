import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';
import { OrderService } from '../../../order-mgmt/order-mgmt.service';
import { TableService } from './../../../../services/table.service';


@Component({
    selector: 'app-order-info-tab',
    templateUrl: './information-tab.component.html',
    styleUrls: ['./order-tab.component.scss'],
    providers: [OrderService]
})
export class SaleOrderInformationTabComponent implements OnInit {

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
        },
        contact: {
            'phone': '',
            'email': ''
        }
    };
    data = {};
    public totalQTY = 0;
    public totalShipQTY = 0;
    public order_info = {
        total: 0,
        order_summary: {},
        sub_total: 0,
        order_date: '',
        customer_po: '',
        total_discount: 0,
        buyer_id: null,
        selected_programs: [],
        discount_percent: 0,
        vat_percent: 0,
        shipping_cost: 0
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
        private orderService: OrderService) {
    }

    ngOnInit() {
        this.getList();

    }

    /**
     * Internal Function
     */

    getList() {

        this.orderService.getOrderDetail(this._orderId).subscribe(res => {
            try {
                this.detail = res.data;
                this.stockValueChange.emit(res.data);

                this.detail.shipping = res.data.shipping_address ? res.data.shipping_address : this.addr_select.shipping;
                this.detail.billing = res.data.billing_address ? res.data.billing_address : this.addr_select.billing;

                this.detail['subs'] = res.data.items;
                this.detail['subs'].forEach((item) => {
                    this.totalQTY += item.quantity;
                    this.totalShipQTY += item.qty_shipped;
                });

                this.order_info['taxs'] = [];
                this.order_info['taxs'] = this.detail['tax_info'];


            } catch (e) {
                console.log(e);
            }
        });
    }

    groupTax(items) {
        this.order_info['taxs'] = [];
        this.order_info['total_tax'] = 0;
        const taxs = items.map(item => item.tax_percent || 0);
        const unique = taxs.filter((i, index) => taxs.indexOf(i) === index);
        unique.forEach((tax, index) => {
            let taxAmount = 0;
            items.filter(item => item.tax_percent === tax).map(i => {
                // taxAmount += (+i.tax_percent * +i.quantity * (+i.sale_price || 0) / 100);
                taxAmount += (+i.tax_percent * +i.quantity * ((+i.sale_price || 0) * (100 - (+i.discount_percent || 0)) / 100) / 100);
            });
            this.order_info['total_tax'] = this.order_info['total_tax'] + taxAmount.toFixed(2);
            this.order_info['taxs'].push({
                value: tax, amount: taxAmount.toFixed(2)
            });
        });
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
        this.orderService.cloneOrder(id).subscribe(res => {
            this.toastr.success(res.message);
            setTimeout(() => {
                this.router.navigate(['/order-management/sale-order/edit', res.data.id]);
            }, 1000);
        }
        );
    }

    putApproveOrder(order_id) {
        // const params = {'status_code': 'AP'};
        this.orderService.approveOrd(order_id).subscribe(res => {
            // if (res.status) {
            this.toastr.success(res.message);
            setTimeout(() => {
                this.router.navigate(['/order-management/sale-order']);
            }, 500);
            // } else {
            //     this.toastr.error(res.message);
            // }
        }
        );
    }

    updateStatusOrder(order_id, status) {
        this.orderService.updateStatusOrder(order_id, status).subscribe(res => {
            // if (res.status) {
            this.toastr.success(res.message);
            setTimeout(() => {
                this.router.navigate(['/order-management/sale-order']);
            }, 500);
            // } else {
            //     this.toastr.error(res.message);
            // }
        }
        );
    }

    cancel() {
        this.router.navigate(['/order-management/sale-order']);
    }

    edit() {
        if (this.detail['edit_message']) {
            this.toastr.error(this.detail['edit_message']);
        } else {
            this.router.navigate(['/order-management/sale-order/edit', this._orderId]);
        }
    }
    
    generateInvoice() {
        const modalRef = this.modalService.open(ConfirmModalContent, { size: 'lg', windowClass: 'modal-md' });
        modalRef.result.then(res => {
            if (res) {
                this.orderService.generateInvoice(this._orderId).subscribe(result => {
                    this.toastr.success(result.message);
                    this.router.navigate(['/financial/invoice/view/' + result.data.id]);
                });
            }
        }, dismiss => { });
        modalRef.componentInstance.message = 'Are you sure that you want to create an invoice for this sales order?';
        modalRef.componentInstance.yesButtonText = 'Yes';
        modalRef.componentInstance.noButtonText = 'No';
    }
}
