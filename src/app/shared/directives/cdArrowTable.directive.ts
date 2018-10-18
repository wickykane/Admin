import { Directive, ElementRef, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { Helper } from './../helper/common.helper';
declare var jQuery: any;

// tslint:disable-next-line:directive-selector
@Directive({ selector: '[cdArrowTable]', providers: [HotkeysService, Helper], exportAs: 'cdArrowTable' })
// tslint:disable-next-line:class-name
export class cdArrowTable implements OnDestroy {
    constructor(private _hotkeysService: HotkeysService, public element: ElementRef, private helper: Helper) {
        this.hotKeyConfig();
    }
    private _selectedIndex;
    private _collection;
    @Output() selectedIndexChange: EventEmitter<any> = new EventEmitter<any>();
    // tslint:disable-next-line:no-output-on-prefix
    @Output() onEnter: EventEmitter<any> = new EventEmitter<any>();

    @Input() set collection(value: any) {
        this._collection = value;
        const newValue = value.length;
        (this.selectedIndex > newValue - 1) ? (this.selectedIndex = newValue - 1) : (this.selectedIndex = 0);
    }

    @Input() set selectedIndex(value: any) {
        this._selectedIndex = value;
    }

    @Input() disabledKey;

    ngOnDestroy() {
        this.resetKeys();
    }

    resetKeys() {
        const keys = Array.from(this._hotkeysService.hotkeys);
        keys.map(key => {
            this._hotkeysService.remove(key);
        });
    }

    reInitKey(keys?) {
        this._hotkeysService.add(keys || []);
    }

    getKeys() {
        return Array.from(this._hotkeysService.hotkeys);
    }

    scrollToTable(selector?) {
        try {
            const top = this.element.nativeElement.offsetTop - 100;
            jQuery(selector || 'html, body, .table-responsive').animate({
                scrollTop: top
            }, 500);
        } catch (e) {
            console.log(e);
        }
    }

    focusElement() {
        const button = this.element.nativeElement.querySelectorAll('tr td:first-child a') && this.element.nativeElement.querySelectorAll('tr td:first-child a')[this._selectedIndex]
            || this.element.nativeElement.querySelectorAll('tr td:first-child button') && this.element.nativeElement.querySelectorAll('tr td:first-child button')[this._selectedIndex]
            || this.element.nativeElement.querySelectorAll('tr td:last-child a:first-child') && this.element.nativeElement.querySelectorAll('tr td:last-child a:first-child')[this._selectedIndex];

        if (button) {
            button.focus();
        }
    }

    hotKeyConfig() {
        this._hotkeysService.add(new Hotkey('up', (event: KeyboardEvent): boolean => {
            if (this._selectedIndex === 0 || this.disabledKey) {
                return;
            }
            this._selectedIndex--;
            this.selectedIndexChange.emit(this._selectedIndex);
            this.focusElement();
        }, undefined, 'Up'));

        this._hotkeysService.add(new Hotkey('down', (event: KeyboardEvent): boolean => {
            if (this._collection.length === 0 || this._selectedIndex === this._collection.length - 1 || this.disabledKey) {
                return;
            }
            this._selectedIndex++;
            this.selectedIndexChange.emit(this._selectedIndex);
            this.focusElement();

        }, undefined, 'Down'));

        this._hotkeysService.add(new Hotkey('space', (event: KeyboardEvent): boolean => {
            if (this._selectedIndex >= 0) {
                this.onEnter.emit(this._selectedIndex);
                this.element.nativeElement.click();
                return false; //  Prevent bubbling
            }
            //  event.preventDefault();
        }, undefined, 'Select'));

    }


}
