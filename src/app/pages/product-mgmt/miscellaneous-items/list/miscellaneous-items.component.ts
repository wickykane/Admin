import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';
import { TableService } from '../../../../services/table.service';
import { MiscellaneousItemsKeyService } from '../keys.control';
import { CommonService } from '../../../../services/common.service';
import { ItemsControl } from '../../../../../../node_modules/@ngu/carousel/src/ngu-carousel/ngu-carousel.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MiscellaneousItemsModalComponent } from '../controlMisscellaneous/misscellaneous-items.modal';

@Component({
    selector: 'app-miscellaneous',
    templateUrl: './miscellaneous-items.component.html',
    animations: [routerTransition()],
    providers: [MiscellaneousItemsKeyService, CommonService]
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

    constructor(public router: Router,
        public fb: FormBuilder,
        public toastr: ToastrService,
        private vRef: ViewContainerRef,
        public tableService: TableService,
        public keyService: MiscellaneousItemsKeyService,
        private commonService: CommonService,
        private modalService: NgbModal
    ) {

        this.searchForm = fb.group({
            'rma_no': [null],
            'so_no': [null],
            'customer': [null],
            'rma_type': [''],
            'status': [''],
            'request_date_from': [null],
            'request_date_to': [null],
            'reception_date_from': [null],
            'reception_date_to': [null],
            'comment': []
        });

        // Assign get list function name, override letiable here
        this.tableService.getListFnName = 'getList';
        this.tableService.context = this;
        //  Init Key
        this.keyService.watchContext.next(this);
    }

    ngOnInit() {
        // Init Fn
        this.getList();
        // this.getListMaster();

        this.user = JSON.parse(localStorage.getItem('currentUser'));
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
    toggleSubRow(id) {
        // tslint:disable-next-line:prefer-conditional-expression
        if (id === this.flagId) {
            this.flagId = '0';
        } else {
            this.flagId = id;
        }
        //   this.showProduct = !this.showProduct;
    }











    getList() {
        const params = { ...this.tableService.getParams(), ...this.searchForm.value };
        Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);
        console.log(params);
        // this.purchaseService.getListPurchaseOrder(params).subscribe(res => {
        //     try {
        //         this.list.items = res.data.rows;
        //         console.log(this.list.items);
        //         this.tableService.matchPagingOption(res.data);
        //     } catch (e) {
        //         console.log(e);
        //     }
        // });
    }
    openModal(){
       const modalRef = this.modalService.open(MiscellaneousItemsModalComponent);
    }
}
