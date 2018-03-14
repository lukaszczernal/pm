import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FlockService } from '../shared/service/flock.service';
import { Flock } from '../models/flock.model';
import { Observable } from 'rxjs/Observable';
import { FlockTypeService } from '../shared/service/flock-type.service';
import { FlockType } from '../models/flock-type.model';

import 'rxjs/add/operator/shareReplay';

@Component({
    selector: 'app-active-flock-overview',
    templateUrl: './active-flock-overview.component.html',
    styleUrls: ['./active-flock-overview.component.scss'],
    providers: [
        FlockService
    ]
})
export class ActiveFlockOverviewComponent implements OnChanges {

    @Input() private flockID: number;

    public name: Observable<string>;
    public breedingPeriod: Observable<number>;
    public typeName: Observable<string>;
    public day: Observable<number>;
    public weight: Observable<number>;

    private  type: Observable<FlockType>;

    constructor(
        private flock: FlockService,
        flockType: FlockTypeService
    ) {

        this.name = flock.currentFlock
            .map(_flock => _flock.name);

        this.type = flock.currentFlock
            .flatMap(_flock => flockType.get(_flock.type))
            .shareReplay(1);

        this.breedingPeriod = this.type
            .map(type => type.breedingPeriod);

        this.typeName = this.type
            .map(type => type.name);

        this.day = flock.growthDays;

        this.weight = flock.lastWeight;

    }

    ngOnChanges(changes: SimpleChanges) {
        const flockIdChange = changes['flockID']
        if (flockIdChange) {
            this.flock.currentFlockId.next(flockIdChange.currentValue);
        }
    }

}
