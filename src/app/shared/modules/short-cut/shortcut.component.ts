import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-shortcut',
    templateUrl: './shortcut.component.html',
    styleUrls: ['./shortcut.component.scss']
})
export class ShortcutComponent implements OnInit {
    @Input() listShortcut: any;
    constructor() {}

    ngOnInit() {}
}
