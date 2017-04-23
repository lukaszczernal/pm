import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { FlockService } from '../../flock.service';
import { FlockInsertsService } from '../../shared/flock-inserts.service';
import { FlockDeceaseService } from '../../shared/flock-decease.service';
import { MarketDeceaseRateService } from '../../../market/market-decease-rate.service';
import { MarketDeceaseRate } from '../../../models/market-decease-rate.model';
import { FlockInsert } from '../../shared/flock-insert.model';
import { FlockTypeService } from '../../../farm/shared/flock-type.service';
import { FlockDeceaseItem } from '../../../models/flock-decease-item.model';
import * as moment from 'moment';
import { Subscription, Observable } from 'rxjs';
import { FlockDecease } from 'app/models/flock-decease.model';
import { FlockDeceaseItemService } from 'app/flock/shared/flock-decease-item.service';

@Component({
    selector: 'app-flock-decease-list',
    templateUrl: './flock-decease-list.component.html',
    styleUrls: ['./flock-decease-list.component.scss']
})
export class FlockDeceaseListComponent implements OnInit, OnDestroy {

    hasInserts = false;
    items: FlockDecease[] = [];
    marketDeceaseRates: Observable<MarketDeceaseRate[]>;

    private deceaseListSub: Subscription;
    private hasInsertsSub: Subscription;

    constructor(
        private marketDeceaseRateService: MarketDeceaseRateService,
        private flockInsertsService: FlockInsertsService,
        private flockDeceaseItemService: FlockDeceaseItemService,
        private flockDeceaseService: FlockDeceaseService,
        private flockTypeService: FlockTypeService,
        private flockService: FlockService,
        private zone: NgZone
    ) { }

    ngOnInit() {

        // TOOD when inserts are deleted we need to remove any affected decease data

        this.hasInsertsSub = this.flockInsertsService.hasInserts
            .do(() => console.log('flock decease list - hasinserts'))
            .subscribe(hasInserts => this.hasInserts = hasInserts);

        this.marketDeceaseRates = this.flockService.currentFlockType
            .do(() => console.log('flock decease list - marketDeceaseRates'))
            .flatMap(flockType => this.marketDeceaseRateService.getByFlockType(flockType.id));

        this.deceaseListSub = this.flockDeceaseService.deceases
            .subscribe(items =>
                this.zone.run(() =>
                    this.items = items
                )
            );

    }

    onDeceaseChange(deceaseForm) {
        if (deceaseForm.dirty) {
            const decease = new FlockDeceaseItem(deceaseForm.value);
            this.flockDeceaseItemService.update.next(decease);
        }
    }

    ngOnDestroy() {
        this.deceaseListSub.unsubscribe();
        this.hasInsertsSub.unsubscribe();
    }

}
