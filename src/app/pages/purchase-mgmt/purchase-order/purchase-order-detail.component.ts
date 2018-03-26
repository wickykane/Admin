import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseService } from "../purchase.service";

//modal
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemModalContent } from "../../../shared/modals/item.modal";


import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { routerTransition } from '../../../router.animations';

@Component({
  selector: 'app-purchase-order-detail',
  templateUrl: './purchase-order-detail.component.html',
  styleUrls: ['./purchase-order.component.scss'],
  animations: [routerTransition()]
})
export class PurchaseOrderDetailComponent implements OnInit {

    generalForm: FormGroup;

    public items: any = [];
    public detail: any =[];
    public listMaster = {};

    constructor(public fb: FormBuilder,
        public router: Router,
        public route: ActivatedRoute,
        public  toastr: ToastsManager,
        public vRef: ViewContainerRef,
        private purchaseService: PurchaseService,
        private modalService: NgbModal) {
            this.toastr.setRootViewContainerRef(vRef);
            this.generalForm = fb.group({
                'cd': [{ value: null, disabled: true }],
                'purchase_quote_cd': [{ value: null, disabled: true }],
                'contract_no': [{ value: null, disabled: true }],
                'supplier_id': [{ value: null, disabled: true }],
                'supplier_name': [{ value: null, disabled: true }],
                'rqst_dt': [{ value: null, disabled: true }],
                'incoterm_id': [{ value: null, disabled: true }],
                'bill_to': [{ value: null, disabled: true }],
                'bill_address': [{ value: null, disabled: true }],
                'ship_to': [{ value: null, disabled: true }],
                'ship_address': [{ value: null, disabled: true }],
                'not_delivery_before': [{ value: null, disabled: true }],
                'des': [{ value: null, disabled: true }]
            });
        }

    ngOnInit() {
        this.route.params.subscribe( params => this.getDetailPurchaseOrder(params.id) );    
    }

    initList() {
        this.getPOCode();
        this.getListQuote();
        this.getListIncoterm();
        this.getListCompanySetup();
        this.getListWarehouse();
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
        var params = {sts: 5}
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
                this.changeAddress('');

            } catch (e) {
                console.log(e);
            }
        });
    }

    getListWarehouse() {
        this.purchaseService.getListWarehouse().subscribe(res => {
            try {
                this.listMaster['shipping'] =  res.results.rows;
                this.changeAddress(1);

            } catch (e) {
                console.log(e);
            }
        });
    }

    getDetailPurchaseOrder(id) {
        this.purchaseService.getDetailPurchaseOrder(id).subscribe(res => {
            try {
                this.generalForm.patchValue(res.results);
                this.generalForm.patchValue({'bill_to': Number(res.results.bill_to)});
                this.generalForm.patchValue({'ship_to': Number(res.results.ship_to)});
                this.detail = res.results.detail;
                this.initList();
            } catch (e) {
                console.log(e);
            }
        });
    }


    changePQ() {
        var id = this.generalForm.value.purchase_quote_id;
        var data = this.listMaster['listquote'].find(function(item) {
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
            var id = this.generalForm.value.ship_to;
            var ship = this.listMaster['shipping'].find(function(item) {
                return item.id == id;
            })
            if (ship) {
                this.generalForm.patchValue({'ship_address':  ship.full_address});
            }

        } else {
            var id = this.generalForm.value.bill_to;
            var bill = this.listMaster['billing'].find(function(item) {
                return item.id == id;
            })
            if (bill) {
                this.generalForm.patchValue({'bill_address':  bill.full_address});
            }

        }
    }

    update() {
        // var params = Object.assign({}, this.generalForm.value);
        // params['detail'] = this.detail;
        // this.purchaseService.createPurchaseOrder(params).subscribe(res => {
        //     try {
        //         setTimeout(() => {
                    this.router.navigate(['/purchase-management/purchase-order']);
        //         }, 2000);
        //         this.toastr.success(res.message);
        //     } catch (e) {
        //         this.toastr.error(e.message);
        //     }
        // });
    }

}
