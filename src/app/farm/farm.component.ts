import { Component, OnInit, OnDestroy } from '@angular/core';
import { FlockService } from '../flock/shared/flock.service';
import { Flock } from '../flock/shared/flock.model';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-farm',
  templateUrl: './farm.component.html'
})
export class FarmComponent implements OnInit, OnDestroy {

    public flocks: Observable<Flock[]>;
    // public flocks: Flock[];

    constructor(
        private flockService: FlockService
    ) {
        this.flocks = flockService.flocks;
    }

    ngOnInit() {}

    ngOnDestroy() {
        this.flockService.unobserve();
    }

};
