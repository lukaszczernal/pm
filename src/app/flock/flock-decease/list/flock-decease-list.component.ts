import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { FlockService } from '../../flock.service';
import { FlockInsertsService } from '../../shared/flock-inserts.service';
import { FlockDeceaseService } from '../flock-decease.service';
import { FlockInsert } from '../../shared/flock-insert.model';
import { FlockTypeService } from '../../../farm/shared/flock-type.service';
import { FlockDecease } from '../flock-decease.model';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-flock-decease-list',
    templateUrl: './flock-decease-list.component.html',
    styleUrls: ['./flock-decease-list.component.scss']
})
export class FlockDeceaseListComponent implements OnInit, OnDestroy {

    hasInserts: boolean = false;
    days: FlockDecease[] = [];

    private deceaseListSub: Subscription;
    private hasInsertsSub: Subscription;

    constructor(
        private flockInsertsService: FlockInsertsService,
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

        this.deceaseListSub = this.flockService.currentFlockType
            .combineLatest(
                this.flockInsertsService.startDate,
                this.flockInsertsService.flockInserts,
                this.flockDeceaseService.flockDeceases,
                this.flockService.currentFlockId,
                 (flockType, startDate, inserts, deceases, flockId) => [flockType.breedingPeriod, startDate, inserts, deceases, flockId])
            .map(([growthDayTotal, startDate, inserts, deceases, flockId]: [number, Date, FlockInsert[], FlockDecease[], number]) => {
                let deceaseDate = moment(startDate);
                let ordinal = 1;
                let dates = [];
                let deceaseQtyIncremental = 0;
                let deceaseRateMarket = 0;
                let quantity = 0;
                let insert;
                let decease: FlockDecease;

                while (growthDayTotal--) {

                    insert = inserts.find(insrt => {
                        return moment(insrt.createDate).isSame(deceaseDate, 'day');
                    }) || {};

                    decease = deceases
                        .find(dcs => moment(dcs.deceaseDate).isSame(deceaseDate, 'day'));

                    decease = decease || new FlockDecease({
                        deceaseDate: deceaseDate.toDate(),
                        quantity: 0,
                        flock: flockId
                    });

                    deceaseQtyIncremental += decease.quantity;
                    deceaseRateMarket = 0.02;

                    quantity = Math.max(quantity +  (insert.quantity || 0) - decease.quantity, 0);

                    dates.push({
                        ordinal: ordinal,
                        decease: decease,
                        deceaseQtyIncremental: deceaseQtyIncremental,
                        deceaseRateMarket: deceaseRateMarket,
                        quantity: quantity,
                        isLastWeekDay: (ordinal % 7) === 0
                    });

                    // Increments
                    ordinal++;
                    deceaseDate.add(1, 'day');
                }

                return dates;
            })
            .do(dates => console.log('dates', dates))
            .subscribe(dates => this.zone.run(() =>
                this.days = dates
            ));

    }

    onDeceaseChange(deceaseForm) {
        if (deceaseForm.dirty) {
            let decease = new FlockDecease(deceaseForm.value);
            this.flockDeceaseService.update.next(decease);
        }
    }

    ngOnDestroy() {
        this.deceaseListSub.unsubscribe();
        this.hasInsertsSub.unsubscribe();
    }

}
