import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../order-mgmt.service';
import { TableService } from './../../../services/table.service';

import { NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { cdArrowTable } from '../../../shared';
import { NgbDateCustomParserFormatter } from '../../../shared/helper/dateformat';
import { ConfirmModalContent } from '../../../shared/modals/confirm.modal';
import { SaleOrderKeyService } from './keys.control';

@Component({
    selector: 'app-sale-order',
    templateUrl: './sale-order.component.html',
    styleUrls: ['./sale-order.component.scss'],
    providers: [TableService, SaleOrderKeyService, { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
    animations: [routerTransition()],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaleOrderComponent implements OnInit {

    /**
     * letiable Declaration
     */
    @ViewChild(cdArrowTable) table: cdArrowTable;

    public messageConfig = {
        'SM': 'Are you sure that you want to submit current order ?',
        'CC': 'Are you sure that you want to cancel current order?',
        'CLONE': 'Are you sure that you want to copy current order?',
        'AP': 'Are you sure that you want to approve current order?',
        'RJ': 'Are you sure that you want to reject current order?',
        'RO': 'Are you sure that you want to re-open current order?',
        'RS': 'Are you sure that you want to create a RMA for the order?'
    };

    public statusConfig = {
        'NW': { color: 'blue', name: 'New', img: './assets/images/icon/new.png' },
        // 'RV': { color: 'bg-secondary', name: 'Revised' },
        'SM': { color: 'texas-rose', name: 'Submited' },
        'AP': { color: 'strong-green', name: 'Approved', img: './assets/images/icon/approved.png' },
        'IP': { color: 'rock-blue', name: 'Allocated' },
        'PP': { color: 'green', name: 'Preparing' },
        'RS': { color: 'darkblue', name: 'Ready To Deliver' },
        'DL': { color: 'pink', name: 'Delivering' },
        'PD': { color: 'bright-grey', name: 'Partial Delivery' },
        'CP': { color: 'lemon', name: 'Completed', img: './assets/images/icon/full_delivered.png' },
        'RJ': { color: 'magenta', name: 'Rejected' },
        'CC': { color: 'red', name: 'Canceled', img: './assets/images/icon/cancel.png' },
    };

    public listMaster = {};
    public selectedIndex = 0;
    public countStatus = [];
    public list = {
        items: []
    };
    //  public showProduct: boolean = false;
    public onoffFilter: any;
    public listMoreFilter: any = [];

    searchForm: FormGroup;

    constructor(public router: Router,
        private cd: ChangeDetectorRef,
        public fb: FormBuilder,
        public toastr: ToastrService,
        private vRef: ViewContainerRef,
        private _hotkeysService: HotkeysService,
        public keyService: SaleOrderKeyService,
        private modalService: NgbModal,
        public tableService: TableService,
        private orderService: OrderService) {

        this.searchForm = fb.group({
            'code': [null],
            'cus_po': [null],
            'quote_no': [null],
            'type': [null],
            'sts': [null],
            'buyer_name': [null],
            'date_type': [null],
            'date_to': [null],
            'date_from': [null]

        });

        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
        this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
    }

    ngOnInit() {
        //  Init Fn
        this.listMoreFilter = [{ value: false, name: 'Date Filter' }];
        this.listMaster['dateType'] = [{ id: 'order_dt', name: 'Order Date' }, { id: 'delivery_dt', name: 'Delivery Date' }];
        this.listMaster['type'] = [{ id: 'PKU', name: 'Pickup ' }, { id: 'NO', name: 'Regular Order' }, { id: 'ONL', name: 'Ecommerce' }, { id: 'XD', name: 'X-Docks' }];
        //  this.countOrderStatus();
        this.getList();
        this.getListStatus();
        this.countOrderStatus();
    }
    /**
     * Table Event
     */
    refresh() {
        if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }

    selectData(index) {
        console.log(index);
    }
    /**
     * Internal Function
     */

    filter(status) {
        const params = { sts: status };
        this.orderService.getListOrder(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }

    countOrderStatus() {
        this.orderService.countStatus().subscribe(res => {
            res.data.map(item => {
                if (this.statusConfig[item.short_name]) {
                    this.statusConfig[item.short_name].count = item.count;
                    this.statusConfig[item.short_name].status = item.id;
                    this.statusConfig[item.short_name].name = item.name;
                }
            });
            this.countStatus = Object.keys(this.statusConfig).map(key => {
                return this.statusConfig[key];
            });
            this.refresh();
        });
    }

    getListStatus() {
        this.orderService.getListStatus().subscribe(res => {
            this.listMaster['status'] = res.data;
            this.refresh();
        });

    }

    getList() {
        const params = { ...this.tableService.getParams(), ...this.searchForm.value };

        Object.keys(params).forEach((key) => {
            if (params[key] instanceof Array) {
                params[key] = params[key].join(',');
            }
            // tslint:disable-next-line:no-unused-expression
            (params[key] === null || params[key] === '') && delete params[key];
        });

        params.order = 'id';
        params.sort = 'desc';

        this.orderService.getListOrder(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
                this.refresh();
            } catch (e) {
                console.log(e);
            }
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
          order_id: item.id
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
    createOrder() {
        this.router.navigate(['/order-management/sale-order/create']);
    }
    viewOrder() {
        const id = this.list.items[this.selectedIndex].id;
        this.router.navigate(['/order-management/sale-order/detail', id]);
    }

    edit(item) {
        if (item.edit_message) {
            this.toastr.error(item.edit_message);
        } else {
            const id = item.id;
            this.router.navigate(['/order-management/sale-order/edit', id]);
        }
    }

    putApproveOrder(order_id) {
        this.orderService.approveOrd(order_id).subscribe(res => {
            this.toastr.success(res.message);
            setTimeout(() => {
                this.getList();
            }, 500);
        });
    }

    updateStatusOrder(order_id, status) {
        this.orderService.updateStatusOrder(order_id, status).subscribe(res => {
            this.toastr.success(res.message);
            setTimeout(() => {
                this.getList();
            }, 500);
        });
    }

    selectTable() {
        this.selectedIndex = 0;
        this.table.element.nativeElement.querySelector('td a').focus();
    }
}
