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
    selector: 'app-warehouse-receipt-create',
    templateUrl: './warehouse-receipt-create.component.html',
    styleUrls: ['./warehouse-receipt.component.scss'],
    animations: [routerTransition()]
})
export class WarehouseReceiptCreateComponent implements OnInit {

    generalForm: FormGroup;
    public items: any = [];

    public listMaster = {};

    constructor(public fb: FormBuilder,
        public router: Router,
        public  toastr: ToastsManager,
        public vRef: ViewContainerRef,
        private purchaseService: PurchaseService,
        private modalService: NgbModal) {
            this.toastr.setRootViewContainerRef(vRef);
            this.generalForm = fb.group({
                'receipt_no': [{ value: null, disabled: true }],
                'po_delivery_id': [null, Validators.required],
                'purchase_order_oli_cd': [null],
                'purchase_order_oli_id': [null],
                'supplier_name':[null, Validators.required],
                'supplier_id': [null],
                'date_of_receipt': [null, Validators.required],
                'delivery_location': [null],
                'des': [null],
                'warehouse_receipt_status_id': [null],
                'receipt_location': [null]


            });
        }

    ngOnInit() {
        this.generationWarehouseReceiptCode();
        this.getListInbound();
    }

    getListInbound() {
        this.purchaseService.getPurchaseOrderDelivery().subscribe(res => {
            try {
                this.listMaster['inbound'] = res.results;
            } catch (e) {
                console.log(e);
            }
        });
    }

    generationWarehouseReceiptCode() {
        this.purchaseService.generationWarehouseReceiptCode().subscribe(res => {
            try {
                this.generalForm.patchValue({'receipt_no': res.results.msg});
            } catch(e) {

            }
        });
    }

    changeInboudDelivery(id) {
        this.purchaseService.getDetailDeliveryOrder(id).subscribe(res => {
            try {
                this.items = res.results.detail;
                this.generalForm.patchValue(res.results);
                this.generalForm.patchValue({'warehouse_receipt_status_id': '1'});
                this.generalForm.patchValue({'receipt_location': res.results.delivery_location});
            } catch(e) {
                console.log(e)
            }
        })
    }

    createWarehouseReceipt() {
        let params =  {};
        params = this.generalForm.value;
        this.items.forEach(function(value, key) {
            value.receipt_qty = Number(value.receipt_qty);
        });
        params['detail'] = this.items;
        this.purchaseService.createWarehouseReceipt(params).subscribe(res => {
            try {
                setTimeout(() => {
                    this.router.navigate(['/purchase-management/warehouse-receipt']);
                }, 2000);
                this.toastr.success(res.message);
            } catch (e) {
                console.log(e);
            }
        });
    }

}
