import { Injectable } from '@angular/core';
import { Hotkey } from 'angular2-hotkeys';
// tslint:disable-next-line:import-blacklist
import { KeyboardBaseService } from './../../../shared/helper/keyServiceBase';
@Injectable()
export class ReceiptKeyService extends KeyboardBaseService {

    keyConfig = {
        receipt_no: {
            element: null,
            focus: true,
        },
        payment_method: {
            element: null,
        },
        customer_id: {
            element: null,
        },
        electronic: {
            element: null,
        },
    };

    // constructor() {
    //     this.watchContext.subscribe(res => {
    //         this.context = res.context;
    //         this._hotkeysService = res.service;
    //         this.initKey();
    //     });
    // }

    // getKeys() {
    //     return Array.from(this._hotkeysService.hotkeys);
    // }


    initKey() {
        // this._hotkeysService.add(new Hotkey('alt+n', (event: KeyboardEvent): boolean => {
        //     event.preventDefault();
        //     this.context.createOrder();
        //     return;
        // }, undefined, 'Create Quotation'));
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f1', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            console.log(this.keyConfig.receipt_no.element);
            if (this.keyConfig.receipt_no.element) {
                this.keyConfig.receipt_no.element.nativeElement.focus();
            }
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus Search'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+n', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.createReceiptVoucher();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Create Receipt Voucher'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+e', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.tableService.searchAction();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+r', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.tableService.resetAction(this.context.searchForm);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+v', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.viewReceiptVoucher();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'View'));


        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+pagedown', (event: KeyboardEvent): boolean => {
            this.context.tableService.pagination.page++;
            if (this.context.tableService.pagination.page > this.context.tableService.pagination.total_page) {
                this.context.tableService.pagination.page = this.context.tableService.pagination.total_page;
                return;
            }
            this.context.tableService.changePage(this.context.tableService.pagination.page);
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Next page'));
        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+pageup', (event: KeyboardEvent): boolean => {
            this.context.tableService.pagination.page--;
            if (this.context.tableService.pagination.page < 1) {
                this.context.tableService.pagination.page = 1;
                return;
            }
            this.context.tableService.changePage(this.context.tableService.pagination.page);
            return;

        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Previous page'));

        this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+t', (event: KeyboardEvent): boolean => {
            event.preventDefault();
            this.context.selectTable();
            return;
        }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Table'));
    }
}
