import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';
import { TableService } from '../../../../services/table.service';
import { NgbDateCustomParserFormatter } from '../../../../shared/helper/dateformat';
import { cdArrowTable } from '../../../../shared/index';
import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';

import { HotkeysService } from 'angular2-hotkeys';
// tslint:disable-next-line:import-blacklist
import { Subject } from 'rxjs';
import { RMAService } from '../rma.service';
import { RMAKeyService } from './keys.control';


@Component({
    selector: 'app-rma',
    templateUrl: './rma.component.html',
    styleUrls: ['../rma.component.scss'],
    providers: [RMAKeyService, TableService, { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }],
    animations: [routerTransition()],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RmaComponent implements OnInit {

    /**
     * Variable Declaration
     */
    public messageConfig = {
        'SB': 'Are you sure that you want to submit this order to approver?',
        'CC': 'Are you sure that you want to cancel this return order?',
        'AP': 'Are you sure that you want to approve and send this return order to warehouse?',
        'RJ': 'Are you sure that you want to reject current order?',
        'RC': 'Are you sure that you want to revise this return order?',
        'CC_AR': 'Are you sure that you want to cancel this order and inform to warehouse?'
    };

    public statusConfig = {
        'NW': { color: 'blue', name: 'New', img: './assets/images/icon/new.png' },
        'SB': { color: 'texas-rose', name: 'Submited' },
        'RS': { color: 'strong-green', name: 'Revised', img: './assets/images/icon/approved.png' },
        'AR': { color: 'rock-blue', name: 'Awaiting Receipt' },
        'IR': { color: 'green', name: 'In Receipt' },
        'RC': { color: 'darkblue', name: 'Received' },
        'CP': { color: 'lemon', name: 'Completed', img: './assets/images/icon/full_delivered.png' },
        'CC': { color: 'red', name: 'Canceled', img: './assets/images/icon/cancel.png' },
    };

    public listMaster = {};
    public selectedIndex = 0;
    public countStatus = [];
    public list = {
        items: []
    };
    public data = {};
    public searchKey = new Subject<any>();
    public selected_message = '';

    searchForm: FormGroup;

    @ViewChild(cdArrowTable) table: cdArrowTable;
    constructor(public router: Router,
        private cd: ChangeDetectorRef,
        public fb: FormBuilder,
        public toastr: ToastrService,
        private vRef: ViewContainerRef,
        public keyService: RMAKeyService,
        private modalService: NgbModal,
        public tableService: TableService,
        private service: RMAService,
        private _hotkeysService: HotkeysService) {

        this.searchForm = fb.group({
            'cd': [null],
            'return_type_id': [null],
            'company_id': [null],
            'warehouse_id': [null],
            'sts_id': [null],
            'buyer_name': [null],
            'request_date_to': [null],
            'request_date_from': [null],

        });

        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;

        this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
    }

    ngOnInit() {
        //  Init Fn
        this.listMaster['dateType'] = [{ id: 'order_dt', name: 'Order Date' }, { id: 'delivery_dt', name: 'Delivery Date' }];
        this.listMaster['type'] = [{ id: 'PKU', name: 'Pickup ' }, { id: 'NO', name: 'Regular Order' }, { id: 'ONL', name: 'Ecommerce' }, { id: 'XD', name: 'X-Docks' }];

        this.getRMAReference();
        // this.countOrderStatus();
        this.getList();

        // Lazy Load filter
        this.data['page'] = 1;
        const params = { page: this.data['page'], length: 100 };
        this.service.getAllCustomer(params).subscribe(res => {
            this.listMaster['customer'] = res.data.rows;
            this.data['total_page'] = res.data.total_page;
            this.refresh();
        });
        this.searchKey.debounceTime(300).subscribe(key => {
            this.data['page'] = 1;
            this.searchCustomer(key);
        });

        this.refresh();
    }
    /**
     * Table Event
     */
    refresh() {
        this.cd.detectChanges();
    }

    selectData(index) {
        console.log(index);
    }

    selectTable() {
        this.selectedIndex = 0;
        this.table.element.nativeElement.querySelector('td a').focus();
    }

    createRMA() {
      this.router.navigate(['/order-management/return-order/create']);
    }

    detailRMA() {
      const id = this.list.items[this.selectedIndex].id;
      this.router.navigate(['/order-management/return-order/detail', id]);
    }

    detailOrder() {
        const id = this.list.items[this.selectedIndex].order_id;
        this.router.navigate(['/order-management/sale-order/detail', id]);
    }
    /**
     * Internal Function
     */

    filter(status) {
        const params = { sts_id: status };
        this.service.getListRMA(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }

    getRMAReference() {
        this.countStatus = [{}, {}];
        this.service.getOrderReference().subscribe(res => {
            this.listMaster['warehouses'] = res.data.warehouses || []; this.refresh();
        });
        this.service.getRMAReference().subscribe(res => {
            this.listMaster['return_status'] = res.data.return_status || [];
            // count status
            this.listMaster['return_status'].map(item => {
                if (this.statusConfig[item.cd]) {
                    this.statusConfig[item.cd].count = item.count;
                    this.statusConfig[item.cd].status = item.id;
                    this.statusConfig[item.cd].name = item.name;
                }
            });
            this.countStatus = Object.keys(this.statusConfig).map(key => {
                return this.statusConfig[key];
            });
            this.listMaster['return_type'] = res.data.return_type || [];
            this.refresh();
        });

    }

    fetchMoreCustomer(data?) {
        this.data['page']++;
        if (this.data['page'] > this.data['total_page']) {
            return;
        }
        const params = { page: this.data['page'], length: 100 };
        if (this.data['searchKey']) {
            params['company_name'] = this.data['searchKey'];
        }
        this.service.getAllCustomer(params).subscribe(res => {
            this.listMaster['customer'] = this.listMaster['customer'].concat(res.data.rows);
            this.data['total_page'] = res.data.total_page;
            this.refresh();
        });
    }

    searchCustomer(key) {
        this.data['searchKey'] = key;
        const params = { page: this.data['page'], length: 100 };
        if (key) {
            params['company_name'] = key;
        }
        this.service.getAllCustomer(params).subscribe(res => {
            this.listMaster['customer'] = res.data.rows;
            this.data['total_page'] = res.data.total_page;
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
        //
        // params.order = 'id';
        // params.sort = 'desc';

        this.list.items = [{}, {}];

        this.service.getListRMA(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
                this.refresh();
            } catch (e) {
                // console.log(e);
            }
        });
        this.refresh();
    }

    updateStatus(id, status) {
        const params = { return_order_id: id, status_id: status };
        this.service.updateStatus(params).subscribe(res => {
            try {
                this.toastr.success(res.message);
                this.getList();
                this.getRMAReference();
            } catch (e) {
                console.log(e);
            }
        });
    }

    confirmModal(id, status, status_item) {
        const modalRef = this.modalService.open(ConfirmModalContent, { size: 'lg', windowClass: 'modal-md' });
        modalRef.result.then(res => {
            if (res) {
                this.updateStatus(id, status);
            }
        }, dismiss => { });
        switch (status) {
            case 2:
                // cancel
                this.selected_message = (status_item < 3) ? this.messageConfig.CC : this.messageConfig.CC_AR ;
                break;
            case 3:
                this.selected_message = this.messageConfig.SB;
                break;
            case 4:
            // this.selected_message = this.messageConfig.reject;
            // break;
            case 5:
            this.selected_message = this.messageConfig.AP;
            break;
        }
        modalRef.componentInstance.message = this.selected_message;
        modalRef.componentInstance.yesButtonText = 'Yes';
        modalRef.componentInstance.noButtonText = 'No';
    }

}
