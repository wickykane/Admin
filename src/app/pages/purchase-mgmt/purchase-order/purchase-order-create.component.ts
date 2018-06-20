import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseService } from "../purchase.service";

//modal
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemModalContent } from "../../../shared/modals/item.modal";


import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../router.animations';

@Component({
  selector: 'app-purchase-order-create',
  templateUrl: './purchase-order-create.component.html',
  styleUrls: ['./purchase-order.component.scss'],
  animations: [routerTransition()]
})
export class PurchaseOrderCreateComponent implements OnInit {

    generalForm: FormGroup;

    public items: any = [];
    public detail: any =[];
    public listMaster = {};

    constructor(public fb: FormBuilder,
        public router: Router,
        public toastr: ToastrService, 
        public vRef: ViewContainerRef,
        private purchaseService: PurchaseService,
        private modalService: NgbModal) {
             
            this.generalForm = fb.group({
                'cd': [{ value: null, disabled: true }],
                'purchase_quote_id': [null],
                'contract_no': [null],
                'supplier_id': [null, Validators.required],
                'supplier_name': [{ value: null, disabled: true }],
                'rqst_dt': [null, Validators.required],
                'incoterm_id': [null],
                'bill_to': [null],
                'bill_address': [{ value: null, disabled: true }],
                'ship_to': [null],
                'ship_address': [{ value: null, disabled: true }],
                'not_delivery_before': [null, Validators.required],
                'des': [null]
            });
        }

    ngOnInit() {
        this.getPOCode();
        this.getListQuote();
        this.getListIncoterm();
        this.getListCompanySetup();
        this.getListWarehouse();
        this.getListSupplier();
        this.generateCodePurchaseQuotation();
    }

    getPOCode() {
        this.purchaseService.getPOCode().subscribe(res => {
            try {
                this.generalForm.patchValue({'cd' : res.results.code})
            } catch (e) {
                console.log(e);
            }
        })
    }

    getListQuote() {
        let params = {sts: 5}
        this.purchaseService.getListQuoteApproved(params).subscribe(res => {
            try {
                this.listMaster['listquote'] = res.results.rows;
            } catch (e) {
                console.log(e);
            }

        });
    }

    getListIncoterm() {
        this.purchaseService.getListIncoterm().subscribe(res => {
            try {
                this.listMaster['incoterm'] = res.results;
            } catch (e) {
                console.log(e);
            }
        });
    }

    getListCompanySetup() {
        this.purchaseService.getListCompanySetup().subscribe(res => {
            try {
                this.listMaster['billing'] =  res.results.rows;
            } catch (e) {
                console.log(e);
            }
        });
    }

    getListWarehouse() {
        this.purchaseService.getListWarehouse().subscribe(res => {
            try {
                this.listMaster['shipping'] =  res.results.rows;
            } catch (e) {
                console.log(e);
            }
        });
    }

    getListSupplier() {
        let params = { page: 1, length: 100 }
        this.purchaseService.getListSupplier(params).subscribe(res => {
            try {
                this.listMaster["supplier"] = res.results.rows;
            } catch (e) {
                console.log(e);
            }
        });
    }

    generateCodePurchaseQuotation() {
        this.purchaseService.generateCodePurchaseQuotation().subscribe(res => {
            try {
                this.generalForm.patchValue({cd: res.results.code});
            } catch(e) {

            }
        });
    }

    changePQ() {
        let id = this.generalForm.value.purchase_quote_id;
        let data = this.listMaster['listquote'].find(function(item) {
            return item.id == id;
        })
        if (data) {
            this.generalForm.patchValue({'supplier_id':  data.supplier_id});
            this.generalForm.patchValue({'supplier_name':  data.supplier_name});
            this.detail = data.purchase_quote_details;
        }
    }

    changeAddress(flag) {
        if (flag) {
            let id = this.generalForm.value.ship_to;
            let ship = this.listMaster['shipping'].find(function(item) {
                return item.id == id;
            })
            if (ship) {
                this.generalForm.patchValue({'ship_address':  ship.full_address});
            }

        } else {
            let id = this.generalForm.value.bill_to;
            let bill = this.listMaster['billing'].find(function(item) {
                return item.id == id;
            })
            if (bill) {
                this.generalForm.patchValue({'bill_address':  bill.full_address});
            }

        }
    }

    createOrder() {
        let params = Object.assign({}, this.generalForm.value);
        params['detail'] = this.detail;
        this.purchaseService.createPurchaseOrder(params).subscribe(res => {
            try {
                setTimeout(() => {
                    this.router.navigate(['/purchase-management/purchase-order']);
                }, 2000);
                this.toastr.success(res.message);
            } catch (e) {
                this.toastr.error(e.message);
            }
        });
    }

}
