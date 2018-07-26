import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[OnlyNumber]'
})
export class OnlyNumber {
    elemRef: ElementRef
    periodAllowed = false;

    constructor(private el: ElementRef) {
        this.elemRef = el;
    }

    @Input() OnlyNumber: boolean;
    @Input() minValue: string;
    @Input() maxValue: string;
    @Input() value: number;

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
        const input = event.target as HTMLInputElement;
        console.log(input.value);
        console.log(this.value);
        if (input.value) {
            const val = Number(input.value);

            if (this.minValue.length) {
                if (val < parseInt(this.minValue, 10) || (isNaN(val) && event.key === '0')) {
                    event.preventDefault();
                }
            }

            if (this.maxValue.length) {
                if (val > parseInt(this.maxValue, 10)) {
                    event.preventDefault();
                }
            }
        }
    }
}
