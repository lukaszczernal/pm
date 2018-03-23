import { Injectable } from '@angular/core';
import { FlockHealth } from '../../models/flock-health.model';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { DatabaseService } from '../../shared/database.service';
import { FlockService } from 'app/shared/service/flock.service';
import * as lf from 'lovefield';
import { FlockCostDbService } from '../../shared/service/flock-cost-db.service';

@Injectable()
export class FlockHealthService {

    public items: ReplaySubject<FlockHealth[]> = new ReplaySubject(1);
    public update: Subject<FlockHealth> = new Subject();
    public refresh: Subject<number> = new Subject();
    public remove: Subject<number> = new Subject();

    constructor(
        private databaseService: DatabaseService,
        private flockService: FlockService,
        private flockCost: FlockCostDbService
    ) {
        console.count('FlockHealthService constructor');

        this.refresh
            .do(fid => console.log('flock health service - refresh - flockID:', fid))
            .flatMap(flockId => this.flockCost.getByFlock(flockId))
            .subscribe(this.items);

        this.flockService.currentFlockId
            .do((id) => console.log('flock health service - currentFlockId:', id))
            .subscribe(this.refresh);

        this.update
            .flatMap(fodder => this.flockCost.update(fodder))
            .withLatestFrom(this.flockService.currentFlockId, (trigger, flockId) => flockId)
            .subscribe(this.refresh);

        this.remove
            .flatMap(id => this.flockCost.remove(id))
            .withLatestFrom(this.flockService.currentFlockId, (trigger, flockId) => flockId)
            .do((iid) => console.log('@@@ flock health service - remove health for flock id:', iid))
            .subscribe(this.refresh);

    }

    get(id): Observable<FlockHealth> {
        return this.items
            .do(f => console.log('flock health service - get', id, f.length))
            .flatMap(items => items)
            .filter(item => item.id === parseInt(id, 10));
    }

    getTotalValue(flockId: number): Observable<number> {
        return this.flockCost.getByFlock(flockId)
            .map(costs => costs
                .reduce((sum, cost) => sum + cost.cost, 0));
    }

}
