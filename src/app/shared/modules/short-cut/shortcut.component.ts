import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-shortcut',
    templateUrl: './shortcut.component.html',
    styleUrls: ['./shortcut.component.scss']
})
export class ShortcutComponent implements OnInit {
    public _list;
    @Input() set listShortcut(list) {
        this._list = list || [];
    }
    constructor() { }

    ngOnInit() { }
}
