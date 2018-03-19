import { Injectable } from '@angular/core';
import { FlockBreedingService } from './flock-breeding.service';
import { FlockAnalyticsDbService } from '../../shared/service/flock-analytics-db.service';
import { FlockService } from '../../shared/service/flock.service';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/switchMapTo';
import { FlockAnalytics } from '../../models/flock-analytics.model';
import { FlocksService } from '../../shared/service/flocks.service';

@Injectable()
export class FlockAnalyticsService {

    flockAnalytics: Observable<FlockAnalytics>;

    constructor(
        flock: FlockService,
        flocks: FlocksService,
        flockBreeding: FlockBreedingService,
        flockAnalyticsDB: FlockAnalyticsDbService
    ) {

        flocks.close
            .withLatestFrom(
                flockBreeding.fcr,
                flockBreeding.eww, // TODO this might not be up to date - we should subscribe
                (currentFlock, fcr, eww) => new FlockAnalytics({
                    eww,
                    fcr,
                    flock: currentFlock.id,
                    deceaseRate: 0,
                    weight: 0,
                    price: 0,
                    income: 0,
                    earnings: 0,
                } as FlockAnalytics)
        )
        .flatMap(fcr => flockAnalyticsDB.update(fcr))
        .subscribe();

    }

}
