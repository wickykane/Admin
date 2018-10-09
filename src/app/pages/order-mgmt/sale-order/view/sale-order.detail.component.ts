import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrintHtmlService } from '.././../../../services/print.service';

import { HotkeysService } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { routerTransition } from '../../../../router.animations';
import { InvoiceModalContent } from '../../../../shared/modals/invoice.modal';
import { OrderService } from '../../order-mgmt.service';
import { SaleOrderViewKeyService } from './keys.control';

@Component({
    selector: 'app-detail-order',
    templateUrl: './sale-order.detail.component.html',
    styleUrls: ['../sale-order.component.scss'],
    providers: [PrintHtmlService, SaleOrderViewKeyService],
    animations: [routerTransition()]
})

export class SaleOrderDetailComponent implements OnInit {
    /**
     * Variable Declaration
     */

    data = {};
    public orderId;
    public orderDetail = {
        order_sts_short_name: ''
    };
    @ViewChild('tabSet') tabSet;

    /**
     * Init Data
     */
    constructor(public sanitizer: DomSanitizer,
        private modalService: NgbModal,
        private printService: PrintHtmlService,
        public toastr: ToastrService,
        private router: Router,
        private orderService: OrderService,
        private _hotkeysService: HotkeysService,
        public keyService: SaleOrderViewKeyService,
        private route: ActivatedRoute) {
        //  Init Key

    }

    ngOnInit() {
        this.data['id'] = this.route.snapshot.paramMap.get('id');
        this.orderId = this.data['id'];
    }
    /**
     * Mater Data
     */
    shortcut(event) {
        setTimeout(() => {
            this.data['shortcut'] = event;
        });
    }

    checkRender(detail) {
        this.orderDetail = detail;
    }
    cancel() {
        this.router.navigate(['/order-management/sale-order']);
    }

    putApproveOrder(order_id) {
        // const params = {'status_code': 'AP'};
        this.orderService.approveOrd(order_id).subscribe(res => {
            // if (res.status) {
            this.toastr.success(res.message);
            setTimeout(() => {
                this.router.navigate(['/order-management/sale-order']);
            }, 500);
            // } else {
            //     this.toastr.error(res.message);
            // }
        }
        );
    }

    updateStatusOrder(order_id, status) {
        this.orderService.updateStatusOrder(order_id, status).subscribe(res => {
            // if (res.status) {
            this.toastr.success(res.message);
            setTimeout(() => {
                this.router.navigate(['/order-management/sale-order']);
            }, 500);
            // } else {
            //     this.toastr.error(res.message);
            // }
        }
        );
    }


    /**
     * Internal Function
     */
    selectTab(id) {
        this.tabSet.select(id);
    }
}
