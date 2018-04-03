import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Form, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { OrderService } from '../order-mgmt.service';
//modal
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemModalContent } from "../../../shared/modals/item.modal";


import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { routerTransition } from '../../../router.animations';

@Component({
    selector: 'app-delivery-order-create',
    templateUrl: './delivery-order-create.component.html',
    styleUrls: ['./delivery-order.component.scss'],
    animations: [routerTransition()]
})
export class DelieveryOrderCreateComponent implements OnInit {

    generalForm: FormGroup;
    public items: any = [];

    public listMaster = {};

    constructor(public fb: FormBuilder,
        public router: Router,
        public  toastr: ToastsManager,
        public vRef: ViewContainerRef,
        private orderService: OrderService,
        private modalService: NgbModal) {
            this.toastr.setRootViewContainerRef(vRef);
            this.generalForm = fb.group({
                'code': [{ value: null, disabled: true }],
                'delivery_type': [null, Validators.required],
                'pickup_location':[null, Validators.required],
                'full_address': [null],
                'pickup_time': [null, Validators.required],
                'pickup_date': [null],
                'contact_name': [{ value: null, disabled: true }],
                'contact_phone': [{ value: null, disabled: true }],
                'order_id': [null, Validators.required],
                'buyer_name': [{ value: null, disabled: true }],
                'address_id':[null, Validators.required],
                'delivery_address': [null],
                'delivery_time':[null, Validators.required],
                'delivery_date': [null],
                'consignee_name': [null],
                'consignee_phone': [null],
                'buyer_id': [null]
            });
        }

    ngOnInit() {
        this.listMaster['deliveryTime'] = [{id: '8-17',name: "8-17"}];
        this.listMaster['deliveryType'] = [
            {id:2, name:'Home Delivery'},
            {id:3, name:'Courier Delivery'},
            {id:1, name:' Customer Pickup'}
        ];

        this.getDeliveryCode();
        this.getListSaleOrder();
        this.getPickupLocation();

    }
    /**
     * Internal Function
     */

     getDeliveryCode() {
         this.orderService.getDeliveryCode().subscribe(res => {
             try {
                 this.generalForm.patchValue({'code': res.results.code});
             } catch(e) {
                 console.log(e);
             }
         })
     }

     getListSaleOrder() {
         this.orderService.getOrderDelievery().subscribe(res => {
             try {
                 this.listMaster['saleOrder'] = res.results;
             } catch(e) {
                 console.log(e);
             }
         })
     }

     getPickupLocation() {
         this.orderService.getPickupLocation().subscribe(res => {
             try {
                 this.listMaster['pickupLocation'] = res.results;
             } catch(e) {
                 console.log(e);
             }
         })
     }

     /**
      * Change Function
      */
     changePickupLocation(pickup_location) {
         let item = this.listMaster['pickupLocation'].filter(function(warehouse){
             if(warehouse.id == pickup_location)
                 return warehouse;
         });
         this.generalForm.patchValue({'full_address': item[0].full_address});
         this.generalForm.patchValue({'contact_name': item[0].contact_name});
         this.generalForm.patchValue({'contact_phone': item[0].contact_phone});

     }

     changeSaleOrder(order_id) {

         let item = this.listMaster['saleOrder'].filter(function(order){
             if(order.id == order_id)
                 return order;
         });
         this.generalForm.patchValue({'buyer_name': item[0].buyer_name});
         this.generalForm.patchValue({'buyer_id': item[0].buyer_id});
         this.listMaster['deliveryLocation'] = item[0].shipping_address;
     }

     getListProduct(order_id, address_id) {
         let item = this.listMaster['deliveryLocation'].filter(function(address){
             if(address.address_id == address_id)
                 return address;
         });
        this.generalForm.patchValue({'delivey_address': item[0].full_address});
         let params ={
             "order_id":order_id,
             "address_id":address_id,
         }
         this.orderService.getProductByOrderAndAddr(params).subscribe(res => {
             this.items = res.results;
         })
     }


    createDeliveryOrder() {
        let params =  {};
        params = this.generalForm.value;
        this.items.forEach(function(value, key) {
            value.delivery_qty = Number(value.delivery_qty);
        });
        params['delivery_order_detail'] = this.items;

        this.orderService.createDeliveryOrder(params).subscribe(res => {
            try {
                setTimeout(() => {
                    this.router.navigate(['/order-management/delievery-order']);
                }, 2000);
                this.toastr.success(res.message);
            } catch (e) {
                console.log(e);
            }
        });
    }


}
