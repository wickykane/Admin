import { Injectable } from '@angular/core';
import { Hotkey } from 'angular2-hotkeys';
import { KeyboardBaseService } from '../../../shared/helper/keyServiceBase';
import { Helper } from './../../../shared/helper/common.helper';


@Injectable()
export class PartKeyService extends KeyboardBaseService {
    keyConfig = {
        year_from: {
            element: null,
            focus: true,
        },
        oem: {
            elment: null,
            focus: true,
        },
        vin: {
            elment: null,
            focus: true,
        },
        partlinks_no_filter: {
            element: null,
        },
        freight_class: {
            element: null,
            focus: true,
        }
    };

    initKey() {
        const page = this.context.data['page_type'];
        if (!page) {
            this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+f1', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
                event.preventDefault();
                const defaultConfig = {
                    vin: 'vin',
                    vehicle: 'year_from',
                    part_number: 'oem'
                };

                const activeTab = defaultConfig[this.context.tabSet.activeId];

                if (this.keyConfig[activeTab].element) {
                    this.keyConfig[activeTab].element.nativeElement.focus();
                }
                const e: ExtendedKeyboardEvent = event;
                e.returnValue = false; // Prevent bubbling
                return e;
            }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus Search'));

            this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+v', (event: KeyboardEvent): boolean => {
                event.preventDefault();
                (document.activeElement as HTMLInputElement).blur();
                this.context.selectTab('vin');
                return;
            }, ['INPUT', 'SELECT', 'TEXTAREA'], 'VIN'));

            this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+e', (event: KeyboardEvent): boolean => {
                event.preventDefault();
                (document.activeElement as HTMLInputElement).blur();
                this.context.selectTab('vehicle');
                return;
            }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Vehicle'));

            this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+p', (event: KeyboardEvent): boolean => {
                event.preventDefault();
                (document.activeElement as HTMLInputElement).blur();
                this.context.selectTab('part_number');
                return;
            }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Part Number'));

            this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+1', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
                event.preventDefault();
                (document.activeElement as HTMLInputElement).blur();
                if (this.keyConfig.partlinks_no_filter.element) {
                    this.keyConfig.partlinks_no_filter.element.nativeElement.focus();
                }
                const e: ExtendedKeyboardEvent = event;
                e.returnValue = false; // Prevent bubbling
                return e;
            }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Focus Filter'));

            this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+t', (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
                this.context.selectTable();
                const e: ExtendedKeyboardEvent = event;
                e.returnValue = false; // Prevent bubbling
                return e;
            }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Select Table'));

            this._hotkeysService.add(new Hotkey('alt+pagedown', (event: KeyboardEvent): boolean => {
                this.context.tableService.pagination.page++;
                if (this.context.tableService.pagination.page > this.context.tableService.pagination.total_page) {
                    this.context.tableService.pagination.page = this.context.tableService.pagination.total_page;
                    return;
                }
                this.context.tableService.changePage(this.context.tableService.pagination.page);
                return;
            }, undefined, 'Next page'));

            this._hotkeysService.add(new Hotkey('alt+pageup', (event: KeyboardEvent): boolean => {
                this.context.tableService.pagination.page--;
                if (this.context.tableService.pagination.page < 1) {
                    this.context.tableService.pagination.page = 1;
                    return;
                }
                this.context.tableService.changePage(this.context.tableService.pagination.page);
                return;
            }, undefined, 'Prev page'));

            //  this._hotkeysService.add(new Hotkey('alt+end', (event: KeyboardEvent): boolean => {
            //      event.preventDefault();
            //      this.context.tableService.pagination.page = this.context.tableService.pagination.total_page;
            //      this.context.tableService.changePage(this.context.tableService.pagination.page);
            //      return;
            //  }, undefined, 'Move to last page'));
            //
            //  this._hotkeysService.add(new Hotkey('alt+home', (event: KeyboardEvent): boolean => {
            //      event.preventDefault();
            //      this.context.tableService.pagination.page = 1;
            //      this.context.tableService.changePage(this.context.tableService.pagination.page);
            //      return;
            //  }, undefined, 'Move to first page'));

            /**
             * SEARCH
             */
            this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+s', (event: KeyboardEvent): boolean => {
                event.preventDefault();
                this.context.tableService.searchActionWithFilter();
                return;
            }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Search'));

            this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+r', (event: KeyboardEvent): boolean => {
                event.preventDefault();
                this.context.tableService.resetAction(this.context.filterForm);
                this.context.tableService.resetAction(this.context.searchForm);
                return;
            }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset'));

            this._hotkeysService.add(new Hotkey('alt+2', (event: KeyboardEvent): boolean => {
                event.preventDefault();
                this.context.tableService.resetAction(this.context.filterForm);
                return;
            }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Reset Filter'));

            if (this.context.listMaster['permission'].edit) {
              this._hotkeysService.add(new Hotkey(`${this.helper.keyBoardConst()}` + '+m', (event: KeyboardEvent): boolean => {
                event.preventDefault();
                this.context.router.navigate(['/product-management/mass-price']);
                return;
              }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Mass Update Price'));
            }
        }

        if (page === 'detail' && this.context.listMaster['permission'].view) {
            this._hotkeysService.add(new Hotkey('alt+backspace', (event: KeyboardEvent): boolean => {
                event.preventDefault();
                this.context.router.navigate(['/product-management/part-list']);
                return;
            }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Back'));

            this._hotkeysService.add(new Hotkey('alt+e', (event: KeyboardEvent): boolean => {
                event.preventDefault();
                this.context.router.navigate(['/product-management/part-list/edit/', this.context.productId]);
                return;
            }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Edit'));
        }

        if (page === 'edit' && this.context.listMaster['permission'].edit) {
            this._hotkeysService.add(new Hotkey('alt+backspace', (event: KeyboardEvent): boolean => {
                event.preventDefault();
                this.context.router.navigate(['/product-management/part-list']);
                return;
            }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Cancel'));

            this._hotkeysService.add(new Hotkey('alt+s', (event: KeyboardEvent): boolean => {
                event.preventDefault();
                if (this.context.generalForm.valid) {
                    this.context.updateItem();
                }
                return;
            }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Save'));

            this._hotkeysService.add(new Hotkey('alt+o', (event: KeyboardEvent): boolean => {
                event.preventDefault();
                this.context.chooseFile.nativeElement.click();
                return;
            }, ['INPUT', 'SELECT', 'TEXTAREA'], 'Upload File'));
        }
    }

}
