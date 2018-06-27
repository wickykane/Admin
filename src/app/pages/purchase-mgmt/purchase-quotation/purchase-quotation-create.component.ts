import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseService } from '../purchase.service';

// modal
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemModalContent } from '../../../shared/modals/item.modal';


import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';

@Component({
    selector: 'app-quotation-create',
    templateUrl: './purchase-quotation-create.component.html',
    styleUrls: ['./purchase-quotation.component.scss'],
    animations: [routerTransition()]
})
export class QuotationCreateComponent implements OnInit {

    generalForm: FormGroup;
    public items: any = [];

    public listMaster = {};

    constructor(public fb: FormBuilder,
        public router: Router,
        public toastr: ToastrService,
        public vRef: ViewContainerRef,
        private purchaseService: PurchaseService,
        private modalService: NgbModal) {

            this.generalForm = fb.group({
                'cd': [{ value: null, disabled: true }],
                'rqst_dt': [null, Validators.required],
                'supplier_id': [null, Validators.required],
            });
        }

    ngOnInit() {
        this.getListSupplier();
        this.generateCodePurchaseQuotation();
    }

    getListSupplier() {
        const params = { page: 1, length: 100 };
        this.purchaseService.getListSupplier(params).subscribe(res => {
            try {
                this.listMaster['supplier'] = res.results.rows;
            } catch (e) {
                console.log(e);
            }
        });
    }

    generateCodePurchaseQuotation() {
        this.purchaseService.generateCodePurchaseQuotation().subscribe(res => {
            try {
                this.generalForm.patchValue({cd: res.results.code});
            } catch (e) {

            }
        });
    }

    addNewProduct(id) {
        this.items = [];
        const correctItem = item => ({
            ...item,
            resale_price: Number(item.resale_price) || 0,
            qty: 1,
            totalItem: item.resale_price,
            products: []
        });
        const modalRef = this.modalService.open(ItemModalContent, {size: 'lg'});
        modalRef.result.then(res => {
            if (res.length > 0) {
                this.items = [...res];
                this.items.map(correctItem);
            }
        });
        modalRef.componentInstance.id = id;
        modalRef.componentInstance.flagBundle = false;
    }

    createQuotation() {
        const params = this.generalForm.value;
        this.items.forEach((value, key) => {
            value.qty = Number(value.qty);
        });
        params['purchase_quote_details'] = this.items;
        this.purchaseService.createPurchaseQuotation(params).subscribe(res => {
            try {
                this.router.navigate(['/purchase-management/purchase-quotation']);
                this.toastr.success(res.message);
            } catch (e) {
                console.log(e);
            }
        });
    }

}
