import { Component, Input, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { DebitMemoService } from '../../debit-memo.service';

@Component({
    selector: 'app-misc-items-modal-content',
    templateUrl: './misc-items.modal.html',
    styleUrls: ['./misc-items.modal.scss'],
    providers: [DebitMemoService]
})
// tslint:disable-next-line:component-class-suffix
export class MiscItemsDebitModalContent implements OnInit {

    public listIgnoredItems = [];
    @Input() set setIgnoredItems(items) {
        if (items && items.length) {
            this.listIgnoredItems = items;
        }
        this.getListItems();
    }
    public listItems = [];
    public listItemSelected = [];
    public isCheckedAll = false;
    public searchForm: FormGroup;

    constructor(
        public activeModal: NgbActiveModal,
        public fb: FormBuilder,
        private toastr: ToastrService,
        private debitService: DebitMemoService) {
        this.searchForm = fb.group({
            no: [null],
            des: [null]
        });
    }

    ngOnInit() {}

    getListItems() {
        const params = { ...this.searchForm.value};
        params['misc_ids_ignore'] = this.listIgnoredItems.join();
        Object.keys(params).forEach((key) => (params[key] === null || params[key] === '') && delete params[key]);
        this.debitService.getListItemsFromMisc(params).subscribe(
            res => {
                try {
                    this.listItems = res.data.misc;
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
            }
        );
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
        this.listItemSelected.forEach(item => {
            item['base_price'] = (item['qty'] * item['price']) || 0;
            item['total_price'] = (item['base_price'] - item['discount']) || 0;
        });
        this.activeModal.close(this.listItemSelected);
    }
}
