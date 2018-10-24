import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';
import { CommonService } from '../../../../services/common.service';
import { StorageService } from '../../../../services/storage.service';
import { cdArrowTable } from '../../../../shared/index';
import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';
import { MiscellaneousItemsKeyService } from '../keys.control';

import { HotkeysService } from 'angular2-hotkeys';

// import { ItemsControl } from '../../../../../../node_modules/@ngu/carousel/src/ngu-carousel/ngu-carousel.interface';

import { TableService } from '../../../../services/table.service';
import { ProductService } from '../../product-mgmt.service';
import { MiscellaneousItemsModalComponent } from '../controlMisscellaneous/misscellaneous-items.modal';
@Component({
    selector: 'app-miscellaneous',
    templateUrl: './miscellaneous-items.component.html',
    animations: [routerTransition()],
    styleUrls: ['./miscellaneous-items.component.scss'],
    providers: [MiscellaneousItemsKeyService, CommonService, ProductService],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MiscellaneousItemsComponent implements OnInit {

    /**
     * letiable Declaration
     */
    public listMaster = {};
    public selectedIndex = 0;
    public list = {
        items: []
    };
    //  public showProduct: boolean = false;
    public flagId = '';

    public user: any;

    searchForm: FormGroup;
    miscTypeList: any;
    @ViewChild(cdArrowTable) table: cdArrowTable;

    constructor(public router: Router,
        public fb: FormBuilder,
        public toastr: ToastrService,
        private vRef: ViewContainerRef,
        public tableService: TableService,
        public keyService: MiscellaneousItemsKeyService,
        public _hotkeysService: HotkeysService,
        private commonService: CommonService,
        private productService: ProductService,
        private modalService: NgbModal,
        private cd: ChangeDetectorRef,
        private storage: StorageService
    ) {

        this.searchForm = fb.group({
            'no': [null],
            'des': [null],
            'type': [null],
        });

        // Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
        //  Init Key
        //  Init Key
        this.keyService.watchContext.next({ context: this, service: this._hotkeysService });
    }

    ngOnInit() {
        // Init Fn
        this.getMiscType();
        this.getList();
        // this.getListMaster();

        this.user = JSON.parse(localStorage.getItem('currentUser'));
        this.listMaster['permission'] = this.storage.getRoutePermission(this.router.url);
    }

    refresh() {
         if (!this.cd['destroyed']) { this.cd.detectChanges(); }
    }
    /**
     * Table Event
     */
    selectData(index) {
        console.log(index);
    }

    selectTable() {
        this.selectedIndex = 0;
        this.table.element.nativeElement.querySelector('td a').focus(); this.refresh();
    }
    /**
     * Internal Function
     */
    toggleSubRow(id) {
        // tslint:disable-next-line:prefer-conditional-expression
        if (id === this.flagId) {
            this.flagId = '0';
        } else {
            this.flagId = id;
        }
        //   this.showProduct = !this.showProduct;
    }
    getMiscType() {
        this.productService.getMiscTypeList().subscribe(res => {
            this.miscTypeList = res['data'];
        });
    }
    getList() {
        const params = { ...this.tableService.getParams(), ...this.searchForm.value };
        Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);
        this.productService.getMiscList(params).subscribe(res => {
            try {
                this.list.items = res.data.rows;
                this.tableService.matchPagingOption(res.data);
                this.refresh();
            } catch (e) {
                console.log(e);
            }
        });
    }
    openModal(isNew, isView, item = {}) {
        const modalRef = this.modalService.open(MiscellaneousItemsModalComponent);
        modalRef.componentInstance.Action = isNew;
        modalRef.componentInstance.isView = isView;
        modalRef.componentInstance.miscItems = item;
        modalRef.result.then(res => {
            if (res) {
                this.getList();
            }


        });

    }
    delete(id) {
        const modalRef = this.modalService.open(ConfirmModalContent);
        modalRef.result.then(result => {
            if (result) {
                this.productService.deleteMisc(id).subscribe(res => {
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
    }
    updateStatus(checked, item) {
        if (item.is_sys === 0 || item.used === 0) {
            if (checked) {
                this.productService.activeStatus(item.id).subscribe(res => {
                    try {
                        this.toastr.success(res.message);
                        this.getList();
                        this.refresh();
                    } catch (e) {
                        console.log(e);
                    }
                });
            } else {
                this.productService.inActiveStatus(item.id).subscribe(res => {
                    try {
                        this.toastr.success(res.message);
                        this.getList();
                        this.refresh();
                    } catch (e) {
                        console.log(e);
                    }
                });
            }
        }
    }
}
