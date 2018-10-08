import { Component, Input, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { RMAService } from '../rma.service';

@Component({
    selector: 'app-items-order-modal-content',
    templateUrl: './items-order.modal.html',
    styleUrls: ['./items-order.modal.scss'],
    providers: [RMAService]
})
// tslint:disable-next-line:component-class-suffix
export class ItemsOrderModalContent implements OnInit {

    public listIgnoredItems = [];
    public orderId = '';
    @Input() set setIgnoredItems(data) {
        if (data && data['items'] && data['items'].length) {
            this.listIgnoredItems = data['items'];
            this.getListItems();
        }
    }
    public listItems = [];
    public listItemSelected = [];
    public isCheckedAll = false;
    public searchForm: FormGroup;

    constructor(
        public activeModal: NgbActiveModal,
        public fb: FormBuilder,
        private toastr: ToastrService,
        private service: RMAService) {
        this.searchForm = fb.group({
            no: [null],
            des: [null]
        });
    }

    ngOnInit() {}

    onSearchList() {
        return this.listIgnoredItems.length && this.getListItems();
    }

    getListItems() {
          this.listItems = this.listIgnoredItems;
          this.listItems.map(item => item.is_checked = false);
    }

    checkAll(ev) {
        this.listItems.forEach(x => (x.is_checked = ev.target.checked));
        this.listItemSelected = this.listItems.filter(_ => _.is_checked);
    }

    isAllChecked() {
        this.isCheckedAll = this.listItems.every(_ => _.is_checked);
        this.listItemSelected = this.listItems.filter(_ => _.is_checked);
    }

    onAddItem() {

        this.activeModal.close(this.listItemSelected);
    }
}
