import { Directive, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

@Directive({ selector: '[cdArrowTable]' })
export class cdArrowTable {
    constructor(private _hotkeysService: HotkeysService) {
        this.hotKeyConfig();
    }
    private _selectedIndex;
    private _collection;

    @Input() set collection(value: any) {
        this._collection = value;
        var newValue = value.length;
        if (this.selectedIndex > newValue - 1) {
            this.selectedIndex = newValue - 1;
        } else {
            this.selectedIndex = 0;
        }
    };

    @Input() set selectedIndex(value: any) {
        this._selectedIndex = value;
    };


    @Output() selectedIndexChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() onEnter: EventEmitter<any> = new EventEmitter<any>();

    ngOnDestroy() {
        this.resetKeys();
    }

    resetKeys() {
        let keys = this._hotkeysService.hotkeys;
        for (const key of keys) {
            console.log(key);
            this._hotkeysService.remove(key);
        }
    }

    hotKeyConfig() {
        this.resetKeys();
        this._hotkeysService.add(new Hotkey('up', (event: KeyboardEvent): boolean => {
            if (this._selectedIndex == 0) {
                return;
            }
            this._selectedIndex--;
            this.selectedIndexChange.emit(this._selectedIndex);
        }, undefined, 'Up'));

        this._hotkeysService.add(new Hotkey('down', (event: KeyboardEvent): boolean => {
            if (this._collection.length == 0 || this._selectedIndex == this._collection.length - 1) {
                return;
            }
            this._selectedIndex++;
            this.selectedIndexChange.emit(this._selectedIndex);

        }, undefined, 'Down'));

        this._hotkeysService.add(new Hotkey('space', (event: KeyboardEvent): boolean => {
            if (this._selectedIndex >= 0) {
                this.onEnter.emit(this._selectedIndex);
                return false; // Prevent bubbling
            }
            // event.preventDefault();
        }, undefined, 'Select'));

    }


}