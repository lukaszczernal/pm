import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { Farm } from './farm.service';

@Component({
  selector: 'app-farm',
  templateUrl: './farm.component.html'
})
export class FarmComponent implements OnInit {
    flockList: Observable<any>; // TODO typings

    constructor(private farm: Farm) {}

    ngOnInit() {
        this.flockList = this.farm.getFlockList();
    }

};
