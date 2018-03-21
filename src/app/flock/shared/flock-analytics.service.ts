import { Injectable } from '@angular/core';
import { FlockBreedingService } from './flock-breeding.service';
import { FlockAnalyticsDbService } from '../../shared/service/flock-analytics-db.service';
import { FlockService } from '../../shared/service/flock.service';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/take';
import 'rxjs/add/operator/partition';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/switchMapTo';
import 'rxjs/add/operator/scan';
import { FlockAnalytics } from '../../models/flock-analytics.model';
import { FlocksService } from '../../shared/service/flocks.service';
import { FlockFodderService } from './flock-fodder.service';
import { FlockSalesService } from './flock-sales.service';
import { Subject } from 'rxjs/Subject';
import { Flock } from 'app/models/flock.model';
import { ReplaySubject } from 'rxjs/ReplaySubject';

type UpdateFunction<T> = (a: T[]) => T[];

@Injectable()
export class FlockAnalyticsService {

    indicators: Observable<FlockAnalytics>;
    flockAnalytics: Observable<FlockAnalytics[]>;

    private refreshAnalytics: Subject<any> = new Subject;
    private flockAnalyticsUpdates: Subject<FlockAnalytics[]> = new Subject;
    private indicatorsCompounds: Observable<any>; // TODO typings

    private _flockAnalytics: ReplaySubject<FlockAnalytics[]> = new ReplaySubject(1);
    private _indicators: ReplaySubject<FlockAnalytics> = new ReplaySubject(1);

    constructor(
        private flock: FlockService,
        private flocks: FlocksService,
        private flockSales: FlockSalesService,
        private flockFodder: FlockFodderService,
        private flockBreeding: FlockBreedingService,
        private flockAnalyticsDB: FlockAnalyticsDbService
    ) {

        this.flockAnalytics = this._flockAnalytics.asObservable();

        flockAnalyticsDB.getAll()
            // .map(items => (list: FlockAnalytics[]) => items)
            .merge(this.flockAnalyticsUpdates)
            // .scan((items: FlockAnalytics[], operation: UpdateFunction<FlockAnalytics>) => operation(items), [])
            .subscribe(this._flockAnalytics);

        this.refreshAnalytics
            .flatMap(() => this.flockAnalyticsDB.getAll())
            .subscribe(this.flockAnalyticsUpdates)

        this.indicatorsCompounds = flock.currentFlockId
            .switchMapTo(this.flockBreeding.currentBreedingDate, (flockId, today) => ({flockId, today}))
            .switchMapTo(this.flockFodder.totalFodderConsumption,
                (compound, totalFodderConsumption) => ({...compound, totalFodderConsumption}))
            .switchMapTo(this.flockSales.items, (compound, sales) => ({...compound, sales}))

        this.indicators = this.indicatorsCompounds
            .map(({ totalFodderConsumption, today, sales, flockId } ) => {
                    const fcr = totalFodderConsumption && today.totalWeight ? totalFodderConsumption / today.totalWeight : 0;
                    const eww = ((1 - today.deceaseRate) * 100 * today.weight) / (fcr * today.day) * 100;

                    const weight = sales
                        .reduce((acc, sale) => acc + sale.weight, 0) / today.totalSales;

                    const price = sales
                        .reduce((acc, sale) => acc + (sale.quantity * sale.price), 0) / today.totalSales;

                    return new FlockAnalytics({
                        eww,
                        fcr,
                        flockId,
                        deceaseRate: today.deceaseRate,
                        weight,
                        price,
                        income: 0,
                        earnings: 0
                    })
                }
            );

        const [flockAnalyticUpdate, flockAnalyticAdd] = flocks.close
            .map(currentFlock => currentFlock.id)
            .flatMap(flockId => this.getFlockAnalytics(flockId).take(1))
            .partition(item => Boolean(item))

        flockAnalyticUpdate
            .switchMapTo(this.indicators.take(1), (analytics, indicators) => analytics.update(indicators))
            .flatMap(indicators => flockAnalyticsDB.update(indicators))
            .subscribe(this.refreshAnalytics);

        flockAnalyticAdd
            .switchMapTo(this.indicators.take(1), (trigger, indicators) => indicators)
            .flatMap(analytics => this.flockAnalyticsDB.update(analytics))
            .subscribe(this.refreshAnalytics);

    }

    private getFlockAnalytics(flockId): Observable<FlockAnalytics> {
        return this.flockAnalytics
            .map(items => items
                .find(item => item.flockId === flockId)
            );
    }

}
