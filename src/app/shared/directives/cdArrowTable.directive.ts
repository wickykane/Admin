import { Directive, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';

// tslint:disable-next-line:directive-selector
@Directive({ selector: '[cdArrowTable]' })
// tslint:disable-next-line:class-name
export class cdArrowTable implements OnDestroy {
    constructor(private _hotkeysService: HotkeysService) {
        this.hotKeyConfig();
    }
    private _selectedIndex;
    private _collection;

    @Input() set collection(value: any) {
        this._collection = value;
        const newValue = value.length;
        (this.selectedIndex > newValue - 1) ? (this.selectedIndex = newValue - 1) : (this.selectedIndex = 0);
    }
    @Input() set selectedIndex(value: any) {
        this._selectedIndex = value;
    }


    @Output() selectedIndexChange: EventEmitter<any> = new EventEmitter<any>();
    // tslint:disable-next-line:no-output-on-prefix
    @Output() onEnter: EventEmitter<any> = new EventEmitter<any>();

    ngOnDestroy() {
        this.resetKeys();
    }

    resetKeys() {
        const keys = Array.from(this._hotkeysService.hotkeys);
        keys.map(key => {
            this._hotkeysService.remove(key);
        });
    }

    hotKeyConfig() {
        this._hotkeysService.add(new Hotkey('up', (event: KeyboardEvent): boolean => {
            if (this._selectedIndex === 0) {
                return;
            }
            this._selectedIndex--;
            this.selectedIndexChange.emit(this._selectedIndex);
        }, undefined, 'Up'));

        this._hotkeysService.add(new Hotkey('down', (event: KeyboardEvent): boolean => {
            if (this._collection.length === 0 || this._selectedIndex === this._collection.length - 1) {
                return;
            }
            this._selectedIndex++;
            this.selectedIndexChange.emit(this._selectedIndex);

        }, undefined, 'Down'));

        this._hotkeysService.add(new Hotkey('space', (event: KeyboardEvent): boolean => {
            if (this._selectedIndex >= 0) {
                this.onEnter.emit(this._selectedIndex);
                return false; //  Prevent bubbling
            }
            //  event.preventDefault();
        }, undefined, 'Select'));

    }


}
