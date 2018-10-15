import { AfterViewInit, ContentChild, Directive, ElementRef, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { EventEmitter } from 'events';
declare var jQuery: any;

@Directive({ selector: '[appKeyNavigate]', providers: [NgSelectComponent] })
export class KeyNavigateDirective implements OnInit, AfterViewInit {
    public _element;
    public _config;

    @Input() set keyConfig(config) {
        this._config = config;
    }

    @Output() keyConfigChange = new EventEmitter();

    @Input('appKeyNavigate') appKeyNavigate;

    constructor(element: ElementRef, private ngSelect: NgSelectComponent) {
        this._element = element;
    }

    @HostListener('keydown', ['$event'])
    onkeydown(event) {
        if (event.shiftKey && event.key === 'Tab') {
            const elementDom = this._config[this._config[this.appKeyNavigate].prev];
            if (elementDom) {
                event.preventDefault();
                if (elementDom.ng_select) {
                    const selectedDom: NgSelectComponent = elementDom.element;
                    selectedDom.focus();
                } else {
                    elementDom.element.nativeElement.focus();
                }
            }
        }

        if (!event.shiftKey && event.key === 'Tab') {
            const elementDom = this._config[this._config[this.appKeyNavigate].next];
            if (elementDom) {
                event.preventDefault();
                if (elementDom.ng_select) {
                    const selectedDom: NgSelectComponent = elementDom.element;
                    selectedDom.focus();
                } else {
                    elementDom.element.nativeElement.focus();
                }
            }
        }
    }

    ngOnInit(): void {
        if (this._config) {
            this.keyConfigChange.emit(this._config);
        }
    }

    ngAfterViewInit(): void {
        const elementDom = this._config[this.appKeyNavigate];
        if (elementDom) {
            elementDom.element = (this._config[this.appKeyNavigate].ng_select) ? this.ngSelect : this._element;
            if (elementDom.focus) {
                (document.activeElement as HTMLInputElement).blur();
                if (elementDom.ng_select) {
                    this.ngSelect.focus();
                } else {
                    this._element.nativeElement.focus();
                }
            }
        }
    }
}
