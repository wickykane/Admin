import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../customer.service';
import { TableService } from './../../../services/table.service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';
import { StorageService } from '../../../services/storage.service';
import { cdArrowTable } from '../../../shared/index';
import { ConfirmModalContent } from '../../../shared/modals/confirm.modal';
import { CustomerKeyService } from './keys.customer.control';

@Component({
    selector: 'app-buyer',
    templateUrl: './customer.component.html',
    styleUrls: ['./customer.component.scss'],
    animations: [routerTransition()],
    providers: [CustomerKeyService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerComponent implements OnInit {

    /**
     * letiable Declaration
     */
    public listMaster = {};
    public selectedIndex = 0;
    public onoffFilter: any;
    public list = {
        items: []
    };
    public showProduct = false;
    public flagId = '';

    public user: any;
    public listMoreFilter: any = [];
    searchForm: FormGroup;
    @ViewChild(cdArrowTable) table: cdArrowTable;
    constructor(public router: Router,
        public fb: FormBuilder,
        public toastr: ToastrService,
        private vRef: ViewContainerRef,
        public tableService: TableService,
        private modalService: NgbModal,
        private customerService: CustomerService,
        public keyService: CustomerKeyService,
        private _hotkeysService: HotkeysService,
        private storage: StorageService,
        private cd: ChangeDetectorRef) {

        this.searchForm = fb.group({
            'buyer_code': [null],
            'buyer_name': [null],
            'email': [null],
            'buyer_type': [null],
            'phone': [null]
        });

        //  Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
        // this.customerKeyService.watchContext.next(this);
        this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
    }

    ngOnInit() {
        //  Init Fn
        this.getList();
        this.listMaster['buyerType'] = [{
            id: 'CP',
            name: 'Company'
        }, {
            id: 'PS',
            name: 'Personal'
        }];

        this.user = JSON.parse(localStorage.getItem('currentUser'));
        this.listMaster['permission'] = this.storage.getRoutePermission(this.router.url);
    }
    /**
     * Table Event
     */
    selectData(index) {
        console.log(index);
    }

    refresh() {
        if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }
    /**
     * Internal Function
     */
    delete(id) {
        const modalRef = this.modalService.open(ConfirmModalContent);
        modalRef.result.then(yes => {
            if (yes) {
                this.customerService.deleteBuyer(id).subscribe(res => {
                    try {
                        this.toastr.success(res.message);
                        this.getList();
                        this.refresh();
                    } catch (e) {
                        console.log(e);
                    }
                });
            }
        });
        modalRef.componentInstance.message = 'Are you sure you want to delete ?';
    }
    createCustomer() {
        this.router.navigate(['/customer/create']);
    }
    viewCustomer() {
        const id = this.list.items[this.selectedIndex].id;
        this.router.navigate(['/customer/view/', id]);
    }
    editCustomer() {
        const id = this.list.items[this.selectedIndex].id;
        this.router.navigate(['/customer/edit/', id]);
    }

    selectTable() {
        this.selectedIndex = 0;
        this.table.element.nativeElement.querySelector('td a').focus();
    }
    getList() {
        const params = { ...this.tableService.getParams(), ...this.searchForm.value };
        console.log(params);
        Object.keys(params).forEach((key) => {
            if (key !== 'email' && (params[key] === null || params[key] === '')) {
                delete params[key];
            }
            if (params['email'] === null || params['email'] === '' || String(params['email']).trim() === '') {
                delete params['email'];
            }
        });

        this.customerService.getListBuyer(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }

}
