import { Component, OnInit } from '@angular/core';
import { FlocksService } from '../../shared/service/flocks.service';
import { Flock } from '../../models/flock.model';
import { Observable } from 'rxjs/Observable';
import { FlockTypeService } from '../../shared/service/flock-type.service';

import 'rxjs/add/operator/combineAll';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

    public allFlocks: Observable<Flock[]>;
    public closedFlocks: Observable<Flock[]>;
    public activeFlocks: Observable<Flock[]>;

    constructor(
        private flocks: FlocksService,
        private flockTypes: FlockTypeService
    ) {}

    ngOnInit() {
        this.allFlocks = this.flocks.flocks;
        this.closedFlocks = this.flocks.closedFlocks;
        this.activeFlocks = this.flocks.activeFlocks;
    }

}
