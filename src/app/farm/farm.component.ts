import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { Flock } from './shared/flock.model';
import { Farm } from './farm.service';

@Component({
  selector: 'app-farm',
  templateUrl: './farm.component.html'
})
export class FarmComponent implements OnInit {
    flockList: Observable<Flock[]>; // TODO typings

    constructor(private farm: Farm) {}

    ngOnInit() {
        this.flockList = this.farm.getFlockList();
    }

};
