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
    selector: 'app-delivery-order-detail',
    templateUrl: './delivery-order-detail.component.html',
    styleUrls: ['./delivery-order.component.scss'],
    animations: [routerTransition()]
})
export class DelieveryOrderDetailComponent implements OnInit {

    generalForm: FormGroup;
    public items: any = [];

    public listMaster = {};

    constructor(public fb: FormBuilder,
        public router: Router,
        public route: ActivatedRoute ,
        public  toastr: ToastsManager,
        public vRef: ViewContainerRef,
        private orderService: OrderService,
        private modalService: NgbModal) {
            this.toastr.setRootViewContainerRef(vRef);
            this.generalForm = fb.group({
                'id': [null],
                'delivery_code': [{ value: null, disabled: true }],
                'delivery_type': [{ value: null, disabled: true }],
                'pickup_location':[{ value: null, disabled: true }],
                'full_address': [{ value: null, disabled: true }],
                'pickup_time': [{ value: null, disabled: true }],
                'pickup_date': [{ value: null, disabled: true }],
                'contact_name': [{ value: null, disabled: true }],
                'contact_phone': [{ value: null, disabled: true }],
                'order_id': [{ value: null, disabled: true }],
                'buyer_name': [{ value: null, disabled: true }],
                'address_id':[{ value: null, disabled: true }],
                'delivery_address': [{ value: null, disabled: true }],
                'delivery_time':[{ value: null, disabled: true }],
                'delivery_date': [{ value: null, disabled: true }],
                'consignee_name': [{ value: null, disabled: true }],
                'consignee_phone': [{ value: null, disabled: true }],
                'buyer_id': [{ value: null, disabled: true }],
                'status_id': [null],
                'status': [null]
            });
        }

    ngOnInit() {
        this.listMaster['deliveryTime'] = [{id: '8-17',name: "8-17"}];
        this.listMaster['deliveryType'] = [
            {id:2, name:'Home Delivery'},
            {id:3, name:'Courier Delivery'},
            {id:1, name:' Customer Pickup'}
        ];
        this.listMaster['status'] = [
         {
            id: 3,
            name: "IN TRANSIT"
        }, {
            id: 4,
            name: "DELIVERED"
        }];

        this.route.params.subscribe( params => this.getDetailDeliveryOrder(params.id) );
        this.getListSaleOrder();
        this.getPickupLocation();

    }
    /**
     * Internal Function
     */

     getDetailDeliveryOrder(id) {
         this.orderService.getDetailDeliveryOrder(id).subscribe(res => {
             try {
                 this.generalForm.patchValue(res.results);
                 this.items = res.results.details;
                 setTimeout(() => {
                     this.changeSaleOrder(res.results.order_id);
                     this.getListProduct(res.results.order_id, res.results.address_id);
                 }, 500);
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
     }

    updateDeliveryOrder() {
        this.generalForm.patchValue({'status': this.generalForm.value.status_id});
        let params =  {};
        params = this.generalForm.value;

        this.orderService.updateDeliveryStatus(this.generalForm.value.id, params).subscribe(res => {
            try {
                setTimeout(() => {
                    this.router.navigate(['/order-management/delivery-order']);
                }, 2000);
                this.toastr.success(res.message);
            } catch (e) {
                console.log(e);
            }
        });
    }


}
