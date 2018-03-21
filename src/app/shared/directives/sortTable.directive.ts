import { Directive, ElementRef, Input, Output, HostListener, EventEmitter, OnInit } from '@angular/core';

@Directive({ selector: '[sortColumn]' })
export class SortColumnDirective implements OnInit {
    public header;
    public _sortParam;

    constructor(private el: ElementRef) {

    }

    ngOnInit() {
        this.header = this.el.nativeElement.innerText;
        this.render();
    }

    @Input('sortColumn') sortKey;
    @Input('sortParam') set sortParam(value) {
        this._sortParam = value;
        if (this.header) {
            if (this._sortParam.order != this.sortKey) {
                this.sort = true;
            }
            this.render();
        }
    }

    @Output() sortFn: EventEmitter<any> = new EventEmitter<any>();
    @Output() sortParamChange: EventEmitter<any> = new EventEmitter<any>();

    private sort = true;
    @HostListener('click') onClick() {
        if (this._sortParam.order == this.sortKey) {
            this.sort = !this.sort;
        }

        this._sortParam = {
            order: this.sortKey,
            sort: (this.sort) ? 1 : -1
        }

        this.render();

        this.sortParamChange.emit(this._sortParam);
        this.sortFn.emit(this._sortParam);

    }

    render() {
        if (this._sortParam.order === this.sortKey) {
            if (this.sort) {
                this.el.nativeElement.innerHTML = (this.header + '&nbsp;<i class="fa fa-sort-asc" aria-hidden="true"></i>');
                // ele.html(text + '&nbsp;<i class="fa fa-sort-asc" aria-hidden="true"></i>');
            }
            else {
                this.el.nativeElement.innerHTML = (this.header + '&nbsp;<i class="fa fa-sort-desc" aria-hidden="true"></i>');

                // element.html(text + '&nbsp;<i class="fa fa-sort-desc" aria-hidden="true"></i>');
            }
        }
        else {
            this.el.nativeElement.innerHTML = (this.header + '&nbsp;<i class="fa fa-sort" aria-hidden="true" style="opacity : 0.2"></i>');
            // element.html(text + '&nbsp;<i class="fa fa-sort" aria-hidden="true" style="opacity : 0.2"></i>');
        }
    }
}