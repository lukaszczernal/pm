import { Component, OnInit } from '@angular/core';
import { FlocksService } from '../../shared/service/flocks.service';
import { Flock } from '../../models/flock.model';
import { Observable } from 'rxjs/Observable';
import { FlockTypeService } from '../../shared/service/flock-type.service';
import { MatTableDataSource } from '@angular/material';
import { FlockAnalyticsDbService } from '../../shared/service/flock-analytics-db.service';

import * as laylow from '../../helpers/lcdash';
import 'rxjs/add/operator/switchMapTo';
import { FlockAnalytics } from '../../models/flock-analytics.model';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

    public allFlocks: Observable<Flock[]>;
    public closedFlocksTable: Observable<MatTableDataSource<Flock>>;
    public closedFlocks: Observable<ClosedFlock[]>;
    public activeFlocks: Observable<Flock[]>;
    public displayedColumns: string[];

    constructor(
        private flocks: FlocksService,
        private flockTypes: FlockTypeService,
        private flockAnalytics: FlockAnalyticsDbService
    ) {}

    ngOnInit() {
        this.allFlocks = this.flocks.flocks;
        this.activeFlocks = this.flocks.activeFlocks;

        this.closedFlocks = this.flocks.closedFlocks
            .map(closedFlocks => closedFlocks
                .map(flock => Object.assign({}, flock) as ClosedFlock)
            )
            .switchMapTo(this.flockAnalytics.getAll(),
                (flocks, analytics) => laylow
                    .mergeJoin([flocks, analytics], 'id', 'flockId', 'analytics')
            )
            .map(closedFlocks => closedFlocks // TODO thats dirty
                .map(flock => {
                    flock.analytics = flock.analytics || {} as FlockAnalytics
                    return flock;
                })
            );

        this.closedFlocksTable = this.closedFlocks
            .map(items => new MatTableDataSource(items));

        this.displayedColumns = ['name', 'eww', 'fcr', 'deceaseRate', 'weight', 'price', 'income', 'earnings'];

    }

}

export interface ClosedFlock extends Flock {
    analytics: FlockAnalytics;
}

