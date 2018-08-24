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
import { ProductService } from '../../product-mgmt.service';
import { ConfirmModalContent } from '../../../../shared/modals/confirm.modal';
@Component({
    selector: 'app-miscellaneous',
    templateUrl: './miscellaneous-items.component.html',
    animations: [routerTransition()],
    providers: [MiscellaneousItemsKeyService, CommonService,ProductService]
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
    miscTypeList:any;
    constructor(public router: Router,
        public fb: FormBuilder,
        public toastr: ToastrService,
        private vRef: ViewContainerRef,
        public tableService: TableService,
        public keyService: MiscellaneousItemsKeyService,
        private commonService: CommonService,
        private productService:ProductService,
        private modalService: NgbModal
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
        this.keyService.watchContext.next(this);
    }

    ngOnInit() {
        // Init Fn
        this.getMiscType();
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
            } catch (e) {
                console.log(e);
            }
        });
    }
    openModal(isNew,isView,item ={}){
       const modalRef = this.modalService.open(MiscellaneousItemsModalComponent);
       modalRef.componentInstance.Action= isNew;
       modalRef.componentInstance.isView= isView;
       modalRef.componentInstance.miscItems= item;
       modalRef.result.then(res => {
           if(res){
            this.getList();
           }


    });

    }
      delete(id){
        const modalRef = this.modalService.open(ConfirmModalContent);
        modalRef.result.then(result => {
          if (result) {
            this.productService.deleteMisc(id).subscribe(res => {
              try {
                this.toastr.success(res.message);
                this.getList();
              } catch (e) {
                console.log(e);
              }
            });
          }
        }); 
    }
}
