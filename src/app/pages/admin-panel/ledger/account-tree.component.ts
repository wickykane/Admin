import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-account-tree',
    templateUrl: 'account-tree.component.html',
    styleUrls: ['ledger.component.scss']
})

export class AccountTreeComponent implements OnInit {
    constructor() { }
    @Input() items;
    @Input() set currentItem(item) {
        this._item = item || {};
    }
    @Input() set expands(item) {
        this._expands = item || [];
    }

    @Input() isRoot;

    @Output() selectedItem = new EventEmitter();
    @Output() expandItem = new EventEmitter();

    public _item;
    public _expands;

    ngOnInit() { }

    selectItem(item) {
        this.selectedItem.emit(item);
    }

    clickItem(event, item) {
        event.stopPropagation();
        this.selectItem(item);
    }

    collapse(item) {
        item.isCollapse = !(this._expands.indexOf(item.id) === -1);
        if (item.isCollapse) {
            if (this._expands.indexOf(item.id) === -1) {
                this._expands.push(item.id);
            }
        } else {
            this._expands = this._expands.filter(i => i !== item.id);
        }

        this.expandItem.emit(this._expands);
    }

    expand(item) {
        this.expandItem.emit(item);
    }
}
