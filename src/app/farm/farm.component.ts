import { Component, OnInit, OnDestroy } from '@angular/core';
import { FlockService } from './shared/flock.service';
import { Flock } from './shared/flock.model';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-farm',
  templateUrl: './farm.component.html'
})
export class FarmComponent implements OnInit, OnDestroy {

    public flocks: Observable<Flock[]>;

    constructor(
        private flockService: FlockService
    ) {}

    ngOnInit() {
        this.flocks = this.flockService.flocks;
    }

    ngOnDestroy() {
        this.flockService.unobserve();
    }

};