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
    public onoffFilter: any;
    public listMoreFilter: any = [];
    searchForm: FormGroup;

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
            'code': [null],
            'cus_po': [null],
            'sale_quote_num': [null],
            'type': [null],
            'sts': [null],
            'buyer_name': [null],
            'date_type': [null],
            'date_to': [null],
            'date_from': [null],
            'ship_date_from': [null],
            'ship_date_to': [null],

        });

        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
    }

    ngOnInit() {
        //  Init Fn
        this.listMaster['listFilter'] = [{ value: false, name: 'Date Filter' }];
        this.listMaster['dateType'] = [{ id: 'issue_date', name: 'Issue Date' }, { id: 'due_date', name: 'Due Date' }];
        this.countInvoiceStatus();
        this.getList();
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
                this.tableService.matchPagingOption(res.data);
            } catch (e) {
                console.log(e);
            }
        });
    }

    deleteInvoice(id) {
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
