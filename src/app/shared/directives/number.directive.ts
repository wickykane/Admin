import { DecimalPipe } from '@angular/common';
import { Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: `[numberDirective]`,
    providers: [NgModel, DecimalPipe]
})
export class NumberDirective implements OnInit {
    _max;
    _min;
    _init = false;
    public regexStr = '^[0-9]*$';
    @Output() changeValue = new EventEmitter();

    @Input() isDecimal;
    @Input() set max(value) {
        this._max = (value >= 0) ? value : Number.POSITIVE_INFINITY;
    }

    @Input() set min(value) {
        this._min = value || 0;
    }

    constructor(private number: DecimalPipe, private element: ElementRef, private ngModel: NgModel) {

    }

    @HostListener('input', ['$event'])
    onInputChange($event) {
        this._init = true;
        const event = $event.target.value;
        let value = (event > this._max) ? this._max : (event < this._min) ? this._min : event;
        const decimal = (String(value).split('.'));
        if (decimal[1] && decimal[1].length > this.isDecimal) {
            value = decimal[0] + '.' + decimal[1].substr(0, this.isDecimal);
        }
        if (event !== value) {
            this.ngModel.viewToModelUpdate(value);
            this.ngModel.valueAccessor.writeValue(value);
        }
        this.changeValue.emit(value);
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event) {
        const e = event;
        const selected = getSelection().toString();
        if ([46, 8, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl+A
            (e.keyCode === 65 && e.ctrlKey === true) ||
            // Allow: Ctrl+C
            (e.keyCode === 67 && e.ctrlKey === true) ||
            // Allow: Ctrl+V
            (e.keyCode === 86 && e.ctrlKey === true) ||
            // Allow: Ctrl+X
            (e.keyCode === 88 && e.ctrlKey === true) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }

        const current: string = (selected) ? '' : this.element.nativeElement.value;
        const ch: string = current.concat(e.key);

        const regEx = new RegExp(this.regexStr);
        if (regEx.test(ch)) {
            return;
        } else {
            e.preventDefault();
        }

    }

    ngOnInit() {
        this.isDecimal = (this.isDecimal === true) ? 2 : this.isDecimal;
        this.regexStr = (this.isDecimal) ? `^[0-9]+[.]?[0-9]{0,${this.isDecimal}}$` : this.regexStr;
        this.ngModel.valueChanges.subscribe(data => {
            if (data && !this._init && this.isDecimal) {
                this.ngModel.valueAccessor.writeValue(Number((+data).toFixed(2)));
                this._init = true;
            }
        });
    }

}
