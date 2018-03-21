import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.scss'],
  animations: [routerTransition()]
})
export class GuideComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
