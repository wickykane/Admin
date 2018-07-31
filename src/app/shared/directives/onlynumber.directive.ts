import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[OnlyNumber]'
})
export class OnlyNumber {
    elemRef: ElementRef
    periodAllowed = false;
    private regex: RegExp = new RegExp(/[0-9]/g);

    constructor(private el: ElementRef) {
        this.elemRef = el;
    }

    @Input() OnlyNumber: boolean;
    @Input() minValue: string;
    @Input() maxValue: string;

    // <input OnlyNumber="true" minValue="1" maxValue="99" />
    @HostListener('keydown', ['$event']) onKeyDown(event) {

        // allow the decimal only when other values are present
        event.target.value.length > 0 ? this.periodAllowed = true : this.periodAllowed = false;


        if (this.OnlyNumber) {
            if ([46, 8, 9, 27, 13, 110].indexOf(event.keyCode) !== -1 ||
                // Allow: Ctrl+A
                (event.keyCode === 65 && event.ctrlKey === true) ||
                // Allow: Ctrl+C
                (event.keyCode === 67 && event.ctrlKey === true) ||
                // Allow: Ctrl+X
                (event.keyCode === 88 && event.ctrlKey === true) ||
                // Allow period
                (event.keyCode === 190 && this.periodAllowed === true) ||
                // Allow: home, end, left, right
                (event.keyCode >= 35 && event.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            }

            // Ensure that it is a number and stop the keypress
            if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
                event.preventDefault();
            }
        }
    }

    @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent) {

        const current: string = this.el.nativeElement.value;
        const next: string = current.concat(event.key);

        if ((next && !String(next).match(this.regex)) ||
            (Number(this.minValue) && +Number(next) < Number(this.minValue)) ||
            (Number(this.maxValue) && +Number(next) > Number(this.maxValue))) {
            event.preventDefault();
        }
    }
}
