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
    @Input() isRoot;
    @Output() selectedItem = new EventEmitter();
    public _item;
    ngOnInit() { }

    selectItem(item) {
        this.selectedItem.emit(item);
    }

    clickItem(event, item) {
        event.stopPropagation();
        this.selectItem(item);
    }

    collapse(item) {
        item.isCollapse = !item.isCollapse;
    }
}
