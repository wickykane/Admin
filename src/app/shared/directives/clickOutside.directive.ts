import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
    //  tslint:disable-next-line:directive-selector
    selector: '[clickOutside]',
})
export class ClickOutsideDirective {
    @Output() public clickOutside = new EventEmitter();
    constructor(private _elementRef: ElementRef) {

    }

    @HostListener('document:click', ['$event.target'])
    public onClick(targetElement) {
        const isClickedInside = this._elementRef.nativeElement.contains(targetElement);
        if (!isClickedInside) {
            this.clickOutside.emit(null);
        }
    }
}
