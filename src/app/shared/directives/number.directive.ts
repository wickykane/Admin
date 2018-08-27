import { DecimalPipe } from '@angular/common';
import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: `[numberDirective]`,
    providers: [NgModel, DecimalPipe]
})
export class NumberDirective implements OnInit {
    @Input() max;
    @Input() min;
    @Input() isDecimal;
    public regexStr = '^[0-9]*$';

    constructor(private number: DecimalPipe, private element: ElementRef, private ngModel: NgModel) {

    }

    @HostListener('ngModelChange', ['$event'])
    onInputChange(event) {
        if (event > this.max) {
            this.ngModel.valueAccessor.writeValue(this.max);
        }
        if (event < this.min) {
            this.ngModel.valueAccessor.writeValue(this.min);
        }
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event) {
        const e = event;
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

        const current: string = this.element.nativeElement.value;
        const ch: string = current.concat(e.key);

        const regEx = new RegExp(this.regexStr);
        if (regEx.test(ch)) {
            return;
        } else {
            e.preventDefault();
        }

    }
    ngOnInit() {
        this.regexStr = (this.isDecimal) ? '^[0-9]+[.]?[0-9]*$' : this.regexStr;
        this.max = this.max || Number.POSITIVE_INFINITY;
        this.min = this.min || 0;
    }
}
