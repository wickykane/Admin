import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseService } from '../purchase.service';

// modal
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemModalContent } from '../../../shared/modals/item.modal';

import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';

@Component({
    selector: 'app-quotation-detail',
    templateUrl: './purchase-quotation-detail.component.html',
    styleUrls: ['./purchase-quotation.component.scss'],
    animations: [routerTransition()]
})
export class QuotationDetailComponent implements OnInit {

    generalForm: FormGroup;
    public items: any = [];
    public idQuotation: string = '';

    public listMaster = {};

    constructor(public fb: FormBuilder,
        public toastr: ToastrService, 
        public router: Router,
        public route: ActivatedRoute,
        public vRef: ViewContainerRef,
        private purchaseService: PurchaseService,
        private modalService: NgbModal) {
             
            this.generalForm = fb.group({
                'cd': [{ value: null, disabled: true }],
                'rqst_dt': [null, Validators.required],
                'supplier_id': [null, Validators.required],
                'purchase_quote_status_name': [{ value: null, disabled: true }],
                'purchase_quote_status_id': [null]
            });
        }

    ngOnInit() {
        this.route.params.subscribe( params => this.getDetailQuotaton(params.id) );
        this.getListSupplier();
        this.items = [];

    }

    getListSupplier() {
        let params = { page: 1, length: 100 }
        this.purchaseService.getListSupplier(params).subscribe(res => {
            try {
                this.listMaster['supplier'] = res.results.rows;
            } catch (e) {
                console.log(e);
            }
        });
    }

    getDetailQuotaton(id) {
        this.idQuotation = id;
        this.purchaseService.getDetailPurchaseQuotation(this.idQuotation).subscribe(res => {
            try {
                this.generalForm.patchValue(res.results);
                this.items = res.results.purchase_quote_details;
            } catch(e) {

            }
        });
    }

    addNewProduct(id) {
        this.items = [];
        const modalRef = this.modalService.open(ItemModalContent, {size: 'lg'});
        modalRef.result.then(res => {
            if (res.length > 0) {
                this.items = Object.assign([], res);
                this.items.forEach(function(item) {
                    if (item.resale_price) item.resale_price = Number(item.resale_price);
                    item['products'] = [];
                    item.qty = 1;
                    item.totalItem = item.resale_price;
                })

            }
        });
        modalRef.componentInstance.id = id;
        modalRef.componentInstance.flagBundle = false;
    }

    updateQuotation() {
        let params =  {};
        params = this.generalForm.value;
        this.items.forEach(function(value, key) {
            value.qty = Number(value.qty);
        });
        params['purchase_quote_details'] = this.items;
        this.purchaseService.upddatePurchaseQuotation(params, this.idQuotation).subscribe(res => {
            try {
                this.router.navigate(['/purchase-management/purchase-quotation']);
                this.toastr.success(res.message);
            } catch (e) {
                console.log(e);
            }
        });
    }

}
