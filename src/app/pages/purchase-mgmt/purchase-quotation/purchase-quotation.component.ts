import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';

@Component({
  selector: 'app-quotation',
  templateUrl: './purchase-quotation.component.html',
  styleUrls: ['./purchase-quotation.component.scss'],
  animations: [routerTransition()]
})
export class QuotationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
