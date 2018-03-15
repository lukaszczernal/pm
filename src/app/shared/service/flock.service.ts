import { Injectable } from '@angular/core';
import { Flock } from '../../models/flock.model';
import { FlockType } from '../../models/flock-type.model';
import { FlocksService } from './flocks.service';
import { FlockTypeService } from './flock-type.service';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { FlockInsertDbService } from './flock-insert-db.service';
import { FlockInsert } from '../../flock/shared/flock-insert.model';
import { FlockWeightDbService } from './flock-weight-db.service';
import * as moment from 'moment';
import * as _ from 'lodash';

import 'rxjs/add/operator/catch';
import { FlockDeceaseDbService } from './flock-decease-db.service';
import { FlockDeceaseItem } from '../../models/flock-decease-item.model';
import { FlockSales } from '../../models/flock-sales.model';
import { FlockSaleDbService } from './flock-sale-db.service';

@Injectable()
export class FlockService {

    public currentFlockId: ReplaySubject<number> = new ReplaySubject(1);
    public currentFlock: Observable<Flock>;
    public currentFlockType: Observable<FlockType>;
    public isActive: Observable<boolean>;

    public firstInsert: Observable<FlockInsert>;
    public startDate: Observable<Date>;
    public inserts: Observable<FlockInsert[]>;
    public totalInserts: Observable<number>;

    public growthDays: Observable<number>;

    public lastWeight: Observable<number>;
    public totalWeight: Observable<number>;

    public deceases: Observable<FlockDeceaseItem[]>;
    public totalDeceases: Observable<number>;

    public sales: Observable<FlockSales[]>;
    public totalSales: Observable<number>;

    public quantity: Observable<number>;

    public density: Observable<number>;

    constructor(
        private flockTypeService: FlockTypeService,
        private flocksService: FlocksService,
        flockDeceases: FlockDeceaseDbService,
        flockInserts: FlockInsertDbService,
        flockWeight: FlockWeightDbService,
        flockSale: FlockSaleDbService
    ) {

        this.currentFlock = this.currentFlockId.asObservable()
            .filter(flockId => Boolean(flockId))
            .flatMap((id) => this.flocksService.get(id))
            .publishReplay(1)
            .refCount();

        this.currentFlockType = this.currentFlock
            .map(flock => flock.type)
            .flatMap(typeId => this.flockTypeService.get(typeId));

        this.isActive = this.currentFlock
            .map(flock => !flock.closeDate);

        this.inserts = this.currentFlockId
            .flatMap(flockId => flockInserts.getByFlock(flockId))

        this.totalInserts = this.inserts
            .map(inserts => inserts
                .map(insert => insert.quantity)
                .reduce((count, insertCount) => count + insertCount, 0)
        );

        // TODO - not a clean code - flockInserts are ordered by date ASC
        this.firstInsert = this.inserts
            .map(inserts => inserts.length > 0 ? inserts[0] : new FlockInsert({}));

        this.startDate = this.firstInsert
            .map(insert => insert.date);

        this.growthDays = this.currentFlock
            .switchMapTo(this.startDate, (flock, startDate) => {
                const endDate = flock.closeDate && new Date(flock.closeDate) || new Date();
                const durationFromFirstInsertion = endDate.getTime() - startDate.getTime();
                return moment.duration(durationFromFirstInsertion).asDays();
            })
            .map(days => Math.round(days));

        this.deceases = this.currentFlockId
            .flatMap(flockId => flockDeceases.getByFlock(flockId));

        this.totalDeceases = this.deceases
            .map(deceases => deceases
                .map(decease => decease.value)
                .reduce((count, dailyDecease) => (count + dailyDecease), 0)
        );

        this.sales = this.currentFlockId
            .flatMap(flockId => flockSale.getByFlock(flockId));

        this.totalSales = this.sales
            .map(sales => sales
                .map(sale => sale.quantity)
                .reduce((count, sale) => count + sale, 0));

        this.quantity = Observable.combineLatest(
            this.totalInserts,
            this.totalDeceases,
            this.totalSales,
            (inserts, deceases, sales) => inserts - deceases - sales
        );

        this.lastWeight = this.currentFlockId
            .flatMap(flockId => flockWeight.getByFlock(flockId))
            .map(weights => _.maxBy(weights, 'date'))
            .map(weight => weight ? weight.value : 0);

        this.totalWeight = Observable.combineLatest(
            this.lastWeight,
            this.quantity,
            (weight, quantity) => weight * quantity
        );

        this.density = Observable.combineLatest(
            this.totalWeight,
            this.currentFlock,
            (weight, flock) => weight / flock.coopSize
        );

    }

}
