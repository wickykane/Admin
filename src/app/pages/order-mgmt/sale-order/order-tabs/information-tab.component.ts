import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysService } from 'angular2-hotkeys';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';
import { OrderService } from '../../../order-mgmt/order-mgmt.service';
import { SaleOrderDetailComponent } from '../view/sale-order.detail.component';
import { TableService } from './../../../../services/table.service';
import { SaleOrderViewKeyService } from './../view/keys.control';


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
        'RS': 'Are you sure that you want to create a RMA for the order?'
    };

    constructor(
        public fb: FormBuilder,
        public toastr: ToastrService,
        private router: Router,
        private vRef: ViewContainerRef,
        private modalService: NgbModal,
        private _hotkeysService: HotkeysService,
        public keyService: SaleOrderViewKeyService,
        public tableService: TableService,
        @Inject(SaleOrderDetailComponent) private parent: SaleOrderDetailComponent,
        private orderService: OrderService) {
        //  Init Key
        if (!this.parent.data['shortcut']) {
            this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
        }
    }

    ngOnInit() {
        this.checkGenerateInvoice();
        this.getList();
        this.data['tab'] = {
            active: 0,
        };
        this.changeShortcut();
    }

    /**
     * Internal Function
     */
    checkGenerateInvoice() {
        this.orderService.generateInvoice(this._orderId, 1).subscribe(res => {
            this.data['enableInvoice'] = res.data;
        });
    }
    changeShortcut() {
        setTimeout(() => {
            this.parent.data['shortcut'] = this.keyService.getKeys();
        });
    }

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

    confirmModal(item, status) {
        const modalRef = this.modalService.open(ConfirmModalContent, { size: 'lg', windowClass: 'modal-md' });
        modalRef.result.then(res => {
            if (res) {
                switch (status) {
                    case 'SM':
                        this.updateStatusOrder(item.id, 6);
                        break;
                    case 'AP':
                        this.updateStatusOrder(item.id, 5);
                        break;
                    case 'RJ':
                        this.updateStatusOrder(item.id, 11);
                        break;
                    case 'CC':
                        this.updateStatusOrder(item.id, 7);
                        break;
                    case 'RO':
                        this.updateStatusOrder(item.id, 1);
                        break;
                    case 'CLONE':
                        this.cloneNewOrder(item.id);
                        break;
                    case 'RS':
                        this.newRMA(item);
                        break;
                }
            }
        }, dismiss => { });
        modalRef.componentInstance.message = this.messageConfig[status];
        modalRef.componentInstance.yesButtonText = 'Yes';
        modalRef.componentInstance.noButtonText = 'No';
    }

    newRMA(item) {
        const data = {
            buyer_id: item.buyer_id,
            order_id: item.id,
            buyer_name: item.buyer_name
        };
        this.router.navigateByData({ url: ['order-management/return-order/create'], data: [data] });
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
            this.getList();
            // setTimeout(() => {
            //     this.router.navigate(['/order-management/sale-order']);
            // }, 500);
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
            this.getList();
            // setTimeout(() => {
            //     this.router.navigate(['/order-management/sale-order']);
            // }, 500);
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
        this.orderService.checkOrderEditable(this._orderId).subscribe(res => {
            this.router.navigate(['/order-management/sale-order/edit', this._orderId]);
        });
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

    changeTab(step) {
        this.data['tab'].active = +this.parent.tabSet.activeId;
        this.data['tab'].active += step;
        this.data['tab'].active = Math.min(Math.max(this.data['tab'].active, 0), 7);
        this.parent.selectTab(String(this.data['tab'].active));
    }
}
