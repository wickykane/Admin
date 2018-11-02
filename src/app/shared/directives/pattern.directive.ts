import { DecimalPipe } from '@angular/common';
import { Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { NgControl, NgModel } from '@angular/forms';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: `[patternDirective]`,
    providers: [NgModel]
})
export class PatternDirective implements OnInit {
    public regexStr = null;
    @Input() set patternDirective(value) {
        this.regexStr = value || '';
    }

    constructor(private element: ElementRef, private ngModel: NgModel, private formControl: NgControl) {
    }


    @HostListener('keydown', ['$event'])
    onKeyDown(event) {
        const e = event;
        const selected = getSelection().toString();
        if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
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
    }

}
