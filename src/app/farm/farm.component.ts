import { Component, OnInit, NgZone } from '@angular/core';
import { FlockService } from './shared/flock.service';
import { Flock } from './shared/flock.model';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-farm',
  templateUrl: './farm.component.html'
})
export class FarmComponent implements OnInit {

    public flocks: Flock[];
    public closedFlocks: Flock[];

    constructor(
        private flockService: FlockService,
        private zone: NgZone
    ) {}

    ngOnInit() {
        this.flockService.activeFlocks
            .subscribe(flocks => this.zone.run(() => this.flocks = flocks));

        this.flockService.closedFlocks
            .subscribe(flocks => this.zone.run(() => this.closedFlocks = flocks));
    }

};
