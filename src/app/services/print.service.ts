import { Injectable, } from '@angular/core';

@Injectable()
export class PrintHtmlService {

    constructor() { }

    public print(printEl: HTMLElement) {
        let printContainer: HTMLElement = document.querySelector('#print-container') as HTMLElement;

        if (!printContainer) {
            printContainer = document.createElement('div');
            printContainer.id = 'print-container';
        }

        const elementCopy = printEl.cloneNode(true);
        printContainer.appendChild(elementCopy);
        this.actionPrint(printContainer);
    }

    actionPrint(printContainer) {
        const popupWinindow = window.open('', '_blank');
        popupWinindow.document.open();
        popupWinindow.document.write(
            '<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">'
             + printContainer.innerHTML + '</html>');
        popupWinindow.document.close();
    }

}
