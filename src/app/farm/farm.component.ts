import { Component, OnInit, NgZone } from '@angular/core';
import { FlocksService } from '../shared/service/flocks.service';
import { Flock } from './../models/flock.model';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-farm',
  templateUrl: './farm.component.html'
})
export class FarmComponent implements OnInit {

    public flocks: Flock[];
    public closedFlocks: Flock[];

    constructor(
        private flocksService: FlocksService,
        private zone: NgZone
    ) {}

    ngOnInit() {
        this.flocksService.activeFlocks
            .subscribe(flocks => this.zone.run(() => this.flocks = flocks));

        this.flocksService.closedFlocks
            .subscribe(flocks => this.zone.run(() => this.closedFlocks = flocks));
    }

};
