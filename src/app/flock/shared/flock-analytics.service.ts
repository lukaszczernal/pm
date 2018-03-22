import { Injectable } from '@angular/core';
import { FlockBreedingService } from './flock-breeding.service';
import { FlockAnalyticsDbService } from '../../shared/service/flock-analytics-db.service';
import { FlockService } from '../../shared/service/flock.service';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/take';
import 'rxjs/add/observable/forkJoin';
import { FlockAnalytics } from '../../models/flock-analytics.model';
import { FlocksService } from '../../shared/service/flocks.service';
import { FlockFodderService } from './flock-fodder.service';
import { FlockSalesService } from './flock-sales.service';
import { Subject } from 'rxjs/Subject';
import { Flock } from 'app/models/flock.model';
import { FlockSaleDbService } from '../../shared/service/flock-sale-db.service';
import { FlockDeceaseItemService } from './flock-decease-item.service';
import { FlockInsertsService } from './flock-inserts.service';

type UpdateFunction<T> = (a: T[]) => T[];

@Injectable()
export class FlockAnalyticsService {

    indicators: Observable<FlockAnalytics>;
    flockAnalytics: Observable<FlockAnalytics[]>;

    private refreshAnalytics: Subject<any> = new Subject;
    private flockAnalyticsUpdates: Subject<FlockAnalytics[]> = new Subject;
    private indicatorsCompounds: Observable<any>; // TODO typings

    constructor(
        private flock: FlockService,
        private flocks: FlocksService,
        private flockSales: FlockSalesService,
        private flockFodder: FlockFodderService,
        private flockSaleDB: FlockSaleDbService,
        private flockInserts: FlockInsertsService,
        private flockDecease: FlockDeceaseItemService,
        private flockBreeding: FlockBreedingService,
        private flockAnalyticsDB: FlockAnalyticsDbService
    ) {

        this.flockAnalytics = flockAnalyticsDB.getAll()
            .merge(this.flockAnalyticsUpdates);

        this.refreshAnalytics
            .flatMap(() => this.flockAnalyticsDB.getAll())
            .subscribe(this.flockAnalyticsUpdates)

        this.indicators = this.flock.currentFlock
            .take(1)
            .switchMap(currentFlock => this.getIndicators(currentFlock));

        flocks.close
            .switchMap(currentFlock => this.getIndicators(currentFlock)
                .flatMap(indicators => this.getFlockAnalytics(currentFlock.id)
                    .map(analytics => analytics ? analytics.update(indicators) : indicators)
                )
            )
            .flatMap(indicators => flockAnalyticsDB.update(indicators))
            .subscribe(this.refreshAnalytics);

    }

    private getFlockAnalytics(flockId): Observable<FlockAnalytics> {
        return this.flockAnalyticsDB.getAll()
            .map(items => items
                .find(item => item.flockId === flockId)
            );
    }

    private getIndicators(flock: Flock): Observable<FlockAnalytics> {
        return Observable.forkJoin(
            this.flockSales.getSalesSummary(flock.id),
            this.flockFodder.getFodderConsumption(flock),
            this.flockDecease.getDeceaseCount(flock.id),
            this.flockInserts.getInsertedQuantity(flock.id),
            this.flockInserts.getGrowthDays(flock),
            (sales, fodderConsumption, deceaseCount, insertedQuantity, breedingDays) => {
                const deceaseRate = deceaseCount / insertedQuantity;
                const averageWeight = sales.weight / sales.quantity;
                const averagePrice = sales.income / sales.weight;
                const fcr = fodderConsumption && sales.weight ? fodderConsumption / sales.weight : 0;
                const eww = ((1 - deceaseRate) * 100 * averageWeight) / (fcr * breedingDays) * 100;

                return new FlockAnalytics({
                    eww,
                    fcr,
                    flockId: flock.id,
                    deceaseRate,
                    weight: averageWeight,
                    price: averagePrice,
                    income: sales.income,
                    earnings: 0
                })
            }
        );

    }

}
