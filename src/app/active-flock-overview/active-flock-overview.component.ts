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

    public id: Observable<number>;
    public name: Observable<string>;
    public breedingPeriod: Observable<number>;
    public typeName: Observable<string>;
    public day: Observable<number>;
    public weight: Observable<number>;
    public deceaseRate: Observable<number>;
    public densityRate: Observable<number>;

    private  type: Observable<FlockType>;

    constructor(
        private flock: FlockService,
        flockType: FlockTypeService
    ) {

        this.id = flock.currentFlock
            .map(currentFlock => currentFlock.id)

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

        this.deceaseRate = Observable.combineLatest(
            flock.totalDeceases,
            flock.totalInserts,
            (deceases, inserts) => deceases / inserts || 0
        );

        this.densityRate = flock.density;

    }

    ngOnChanges(changes: SimpleChanges) {
        const flockIdChange = changes['flockID']
        if (flockIdChange) {
            this.flock.currentFlockId.next(parseInt(flockIdChange.currentValue, 10));
        }
    }

}
