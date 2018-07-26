import { Component, ElementRef, OnInit, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FinancialService } from '../financial.service';
import { TableService } from './../../../services/table.service';

import { ConfirmModalContent } from '../../../shared/modals/confirm.modal';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { InvoiceKeyService } from './keys.list.control';

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.scss'],
    animations: [routerTransition()],
    providers: [InvoiceKeyService]
})
export class InvoiceComponent implements OnInit {

    /**
     * letiable Declaration
     */
    @ViewChild('inp') inp: ElementRef;

    public listMaster = {};
    public selectedIndex = 0;
    public countStatus = {};
    public list = {
        items: []
    };
    public listInvoiceItemsRef = {};
    public onoffFilter: any;
    public listMoreFilter: any = [];
    searchForm: FormGroup;
    public dateType = 0;

    constructor(public router: Router,
        public fb: FormBuilder,
        public toastr: ToastrService,
        private vRef: ViewContainerRef,
        public keyService: InvoiceKeyService,
        private modalService: NgbModal,
        public tableService: TableService,
        private financialService: FinancialService,
        private renderer: Renderer) {

        this.searchForm = fb.group({
            'inv_num': [null],
            'cus_name': [null],
            'order_num': [null],
            'sku': [null],
            'status': [null],
            'inv_type': [null],
            'inv_dt_from': [null],
            'inv_dt_to': [null],
            'inv_due_dt_from': [null],
            'inv_due_dt_to': [null],
        });

        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
        this.keyService.watchContext.next(this);
    }

    ngOnInit() {
        //  Init Fn
        // this.listMoreFilter = [{ value: false, name: 'Date Filter' }];
        this.listMaster['listFilter'] = [{ value: false, name: 'Date Filter' }];
        this.listMaster['dateType'] = [{ id: 0, name: 'Issue Date' }, { id: 1, name: 'Due Date' }];
        this.listMaster['status'] = [
            { id: 1, name: 'New' },
            { id: 2, name: 'Submitted' },
            { id: 3, name: 'Rejected' },
            { id: 4, name: 'Approved' },
            { id: 5, name: 'Partially Paid' },
            { id: 6, name: 'Fully Paid' }
        ];
        this.listMaster['inv_type'] = [
            { id: 1, name: 'Sales Order' }
        ];
        this.getListInvoiceItemsRef();
        this.countInvoiceStatus();
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

    moreFilter() {
        this.onoffFilter = !this.onoffFilter;
        setTimeout(() => {
            this.renderer.invokeElementMethod(this.inp.nativeElement, 'focus');
        }, 300);
    }

    onFilterChanged(value) {
        if (!value) {
            this.searchForm.patchValue({
                'inv_dt_from': null,
                'inv_dt_to': null,
                'inv_due_dt_from': null,
                'inv_due_dt_to': null
            });
        }
    }

    onDateTypeChanged() {
        this.searchForm.patchValue({
            'inv_dt_from': null,
            'inv_dt_to': null,
            'inv_due_dt_from': null,
            'inv_due_dt_to': null
        });
    }

    countInvoiceStatus() {
        this.financialService.countInvoiceStatus().subscribe(res => {
            this.countStatus = res.data;
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

        this.financialService.getListInvoice(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.appendItemsToInvoice();
                this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }

    createInvoice() {
        this.router.navigate(['/financial/invoice/create']);
    }

    viewInvoice(id?) {
        if (id) {
            this.router.navigate(['/financial/invoice/view', id]);
        } else {
            const selectedInvoiceId = this.list.items[this.selectedIndex].id;
            if (selectedInvoiceId) {
                this.router.navigate(['/financial/invoice/view', selectedInvoiceId]);
            }
        }
    }

    editInvoice(id?) {
        if (id) {
            this.router.navigate(['/financial/invoice/edit', id]);
        } else {
            const selectedInvoiceId = this.list.items[this.selectedIndex].id;
            const selectedInvoiceStatus = this.list.items[this.selectedIndex].invoice_status_id;
            if (selectedInvoiceId && selectedInvoiceStatus === 1) {
                this.router.navigate(['/financial/invoice/edit', selectedInvoiceId]);
            }
        }
    }

    getListInvoiceItemsRef() {
        this.financialService.getListInvoiceItemsRef().subscribe(res => {
            try {
                this.listInvoiceItemsRef = res.data;
                this.getList();
            } catch (e) {
                console.log(e);
            }
        }, err => {
            this.getList();
        });
    }

    appendItemsToInvoice() {
        const listItems = this.list.items;
        const listItemsRef = this.listInvoiceItemsRef;
        for (const unit of listItems) {
            if (unit['id']) {
                unit['items_details'] = listItemsRef[unit['id']];
            }
        }
    }

    convertStatus(id, key) {
        const stt = this.listMaster[key].find(item => item.id === id);
        return stt.name;
    }

    cancelInvoice(id?) {
        const selectedInvoiceId = id ? id : this.list.items[this.selectedIndex].id;
        const selectedInvoiceStatus = this.list.items[this.selectedIndex].invoice_status_id;
        if (selectedInvoiceId && selectedInvoiceStatus === 1) {
            const modalRef = this.modalService.open(ConfirmModalContent);
            modalRef.result.then(result => {
                if (result) {
                    this.financialService.deleteInvoice(id).subscribe(res => {
                        try {
                            this.toastr.success(res.message);
                            this.getList();
                        } catch (e) {
                            console.log(e);
                        }
                    });
                }
            }, dismiss => { });
        }
    }

}
