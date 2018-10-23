import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from './../../../services/table.service';
import { SaleQuoteKeyService } from './keys.list.control';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { StorageService } from '../../../services/storage.service';
import { cdArrowTable } from '../../../shared/index';
import { OrderService } from '../order-mgmt.service';
import { ConfirmModalContent } from './../../../shared/modals/confirm.modal';


@Component({
    selector: 'app-sale-quotation',
    templateUrl: './sale-quotation.component.html',
    styleUrls: ['./sale-quotation.component.scss'],
    providers: [SaleQuoteKeyService, TableService],
    animations: [routerTransition()],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaleQuotationComponent implements OnInit {
    /**
     * letiable Declaration
     */

    public listMaster = {};
    public selectedIndex = 0;
    public list = {
        items: []
    };
    public user: any;
    public onoffFilter: any;

    searchForm: FormGroup;

    public messageConfig = {
        'SM': 'Are you sure that you want to Submit this quotation to approver?',
        'CC': 'Are you sure that you want to cancel this quotation?',
        'CLONE': 'Are you sure that you want to copy this quote?',
        'AM': 'Are you sure that you want to approve this quotation?',
        'RM': 'Are you sure that you want to reject this quotation?',
        'SC': 'Are you sure that you want to convert this quotation to SO?',
    };

    public statusConfig = {
        'NW': { color: 'blue', name: 'New', img: './assets/images/icon/new.png' },
        'SM': { color: 'texas-rose', name: 'Submited' },
        'RM': { color: 'magenta', name: 'Rejected' },
        'AM': { color: 'strong-green', name: 'Approved', img: './assets/images/icon/approved.png' },
        // 'RB': { color: 'magenta', name: 'Rejected By Buyer' },
        // 'AB': { color: 'strong-green', name: 'Approved By Buyer', img: './assets/images/icon/approved.png' },
        'CC': { color: 'red', name: 'Canceled', img: './assets/images/icon/cancel.png' },
        'SC': { color: 'lemon', name: 'Completed', img: './assets/images/icon/full_delivered.png' },
        // 'RO': { color: 'darkblue', name: 'Reopen' },
        // 'IU': { color: 'darkblue', name: 'In use' },
        'EX': { color: 'bright-grey', name: 'Expired' },
    };

    @ViewChild(cdArrowTable) table: cdArrowTable;
    constructor(public router: Router,
        private cd: ChangeDetectorRef,
        public fb: FormBuilder,
        public toastr: ToastrService,
        public tableService: TableService,
        private orderService: OrderService,
        private modalService: NgbModal,
        private _hotkeysService: HotkeysService,
        public keyService: SaleQuoteKeyService,
        private storage: StorageService,
        private renderer: Renderer) {

        this.searchForm = fb.group({
            'quote_no': [null],
            'buyer_name': [null],
            'sts': [null],
            'date_type': [null],
            'date_from': [null],
            'date_to': [null]
        });

        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
        //  Init Key
        this.keyService.watchContext.next({ context: this, service: this._hotkeysService });

    }

    ngOnInit() {
        //  Init Fn
        this.listMaster['listFilter'] = [{ value: false, name: 'Date Filter' }];
        this.listMaster['dateType'] = [{ id: 'quote_dt', name: 'Quote Date' }, { id: 'expiry_dt', name: 'Expiry Date' }, { id: 'delivery_dt', name: 'Delivery Date' }];
        this.getList();
        this.getListStatus();
        this.user = JSON.parse(localStorage.getItem('currentUser'));
        this.listMaster['permission'] = this.storage.getRoutePermission(this.router.url);
    }
    /**
     * Table Event
     */
    selectData(index) {
        console.log(index);
    }
    /**
     * Internal Function
     */
    refresh() {
         if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }

    getListStatus() {
        this.orderService.getListSaleQuotationStatus().subscribe(res => {
            try {
                this.listMaster['listStatus'] = res.data;
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }

    moreFilter() {
        this.onoffFilter = !this.onoffFilter;
    }

    filter(status) {
        const params = { sts: status };
        this.orderService.getListSalesQuotation(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }

    getCountStatus() {
        this.orderService.getQuoteCountStatus().subscribe(res => {
            res.data.map(item => {
                if (this.statusConfig[item.cd]) {
                    this.statusConfig[item.cd].count = item.count;
                    this.statusConfig[item.cd].status = item.id;
                    this.statusConfig[item.cd].name = item.name;
                }
            });
            this.listMaster['count-status'] = Object.keys(this.statusConfig).map(key => {
                return this.statusConfig[key];
            });
            this.refresh();
        });
    }

    getList() {
        this.getCountStatus();
        const params = { ...this.tableService.getParams(), ...this.searchForm.value };

        Object.keys(params).forEach((key) => {
            if (params[key] instanceof Array) {
                params[key] = params[key].join(',');
            }
            // tslint:disable-next-line:no-unused-expression
            (params[key] === null || params[key] === '') && delete params[key];
        });
        Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);

        this.orderService.getListSalesQuotation(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
                this.refresh();
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
                this.getCountStatus();
            } catch (e) {
                console.log(e);
            }
        });
    }

    cloneQuote(id) {
        this.router.navigate(['/order-management/sale-quotation/create'], { queryParams: { is_copy: 1, quote_id: id } });
    }

    createQuote() {
        this.router.navigate(['/order-management/sale-quotation/create']);
    }

    viewQuote() {
        const id = this.list.items[this.selectedIndex].id;
        this.router.navigate(['/order-management/sale-quotation/detail', id]);
    }

    selectTable() {
        this.selectedIndex = 0;
        this.table.element.nativeElement.querySelector('td a').focus(); this.refresh();
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
}


