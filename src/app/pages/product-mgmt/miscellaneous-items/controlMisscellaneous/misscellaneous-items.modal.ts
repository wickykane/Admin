import { state } from '@angular/animations';
import { Component, Input, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../services/common.service';
import { ProductService } from '../../product-mgmt.service';

@Component({
    selector: 'misscellaneous-items-modal',
    templateUrl: './misscellaneous-items.modal.html',
    providers: [CommonService, ProductService]
})
export class MiscellaneousItemsModalComponent implements OnInit, OnDestroy {

    generalForm: FormGroup;
    @Input() id;
    @Input() Action;
    @Input() isView;
    @Input() miscItems;
    miscTypeList: any;
    accountList: any;
    title: any = "";
    constructor(public fb: FormBuilder,
        public router: Router,
        public toastr: ToastrService,
        private modalService: NgbModal,
        private hotkeysService: HotkeysService,
        private commonService: CommonService,
        private productService: ProductService,
        public activeModal: NgbActiveModal) {





    }
    getMiscType() {
        this.productService.getMiscTypeList().subscribe(res => {
            this.miscTypeList = res['data'];
        });
    }
    getgenerateMiscNumber() {
        this.productService.generateMiscNumber().subscribe(res => {
            this.generalForm.controls.no.patchValue((res['message']));
        });
    }
    getAccountList() {
        this.productService.getAccountList().subscribe(res => {
            this.accountList = res['data']['children'];
        });
    }
    ngOnInit() {
        if (this.Action == true) {
            this.title = "Add new";
            this.buildForm();
            this.getgenerateMiscNumber();
        }
        else {

            if (this.isView) {
                this.title = "View";
            } if(!this.isView) {
                this.title = "Edit";
            }
            if(this.miscItems.is_sys==1){
                this.editSystemForm();
            }
            if(this.miscItems.is_sys==0){
                this.editForm();
            }
        }
        this.getMiscType();
        this.getAccountList();
    }

    ngOnDestroy() {
    }



    closeModal(data) {
        this.activeModal.close(data);
    }

    closeX() {
        const data = {};
        this.activeModal.close(false);
    }
    saveModal() {
        if (this.Action == true) {
            this.productService.createNewMiscItems(this.generalForm.value).subscribe(res => {
                this.activeModal.close(true);
            });
        }
        else {
            this.productService.updateMiscItems(this.miscItems['id'], this.generalForm.getRawValue()).subscribe(res => {
                this.toastr.success(res.message);
                this.activeModal.close(true);
            });
        }

    }
    buildForm() {
        this.generalForm = this.fb.group({
            'type': ['1'],
            'des': [''],
            'account_id': ['1'],
            "uom": "Each",
            "sts": [''],
            "no": ['']
        });
    }
    editForm() {
        this.generalForm = this.fb.group({
            'type': [{ value: this.miscItems['type'], disabled: this.isView }],
            'des': [{ value: this.miscItems['des'], disabled: this.isView }],
            'account_id': [{ value: this.miscItems['account_id'], disabled: this.isView }],
            "uom": [{ value: this.miscItems['uom'], disabled: this.isView }],
            "sts": [{ value: this.miscItems['sts'], disabled: this.isView }],
            "no": [{ value: this.miscItems['no'], disabled: this.isView }]
        });
    }
    editSystemForm() {
        this.generalForm = this.fb.group({
            'type': [{ value: this.miscItems['type'], disabled: true }],
            'des': [{ value: this.miscItems['des'], disabled: true }],
            'account_id': [{ value: this.miscItems['account_id'], disabled: this.isView }],
            "uom": [{ value: this.miscItems['uom'], disabled: true }],
            "sts": [{ value: this.miscItems['sts'], disabled: true }],
            "no": [{ value: this.miscItems['no'], disabled: true }]
        });
    }
}
