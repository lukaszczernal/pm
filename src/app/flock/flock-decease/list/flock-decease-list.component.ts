import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { FlockService } from '../../flock.service';
import { FlockInsertsService } from '../../shared/flock-inserts.service';
import { FlockDeceaseService } from '../flock-decease.service';
import { FlockSalesService } from '../../shared/flock-sales.service';
import { MarketDeceaseRateService } from '../../../market/market-decease-rate.service';
import { MarketDeceaseRate } from '../../../models/market-decease-rate.model';
import { FlockInsert } from '../../shared/flock-insert.model';
import { FlockTypeService } from '../../../farm/shared/flock-type.service';
import { FlockDecease } from '../flock-decease.model';
import { FlockSales } from '../../../models/flock-sales.model';
import * as moment from 'moment';
import { Subscription, Observable } from 'rxjs';

@Component({
    selector: 'app-flock-decease-list',
    templateUrl: './flock-decease-list.component.html',
    styleUrls: ['./flock-decease-list.component.scss']
})
export class FlockDeceaseListComponent implements OnInit, OnDestroy {

    hasInserts: boolean = false;
    dates: FlockDecease[] = [];
    marketDeceaseRates: Observable<MarketDeceaseRate[]>;

    private deceaseListSub: Subscription;
    private hasInsertsSub: Subscription;

    constructor(
        private marketDeceaseRateService: MarketDeceaseRateService,
        private flockInsertsService: FlockInsertsService,
        private flockDeceaseService: FlockDeceaseService,
        private flockSalesService: FlockSalesService,
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

        this.deceaseListSub = this.flockService.currentFlockType
            .combineLatest(
                this.flockInsertsService.startDate,
                this.flockInsertsService.flockInserts,
                this.flockDeceaseService.flockDeceases,
                this.flockService.currentFlockId,
                this.flockSalesService.sales,
                 (flockType, startDate, inserts, deceases, flockId, sales) => [
                     flockType.breedingPeriod, startDate, inserts, deceases, flockId, sales])
            .map(([growthDayTotal, startDate, inserts, deceases, flockId, sales]: [
                number, Date, FlockInsert[], FlockDecease[], number, FlockSales[]]) => {
                let deceaseDate = moment(startDate);
                let day = 1;
                let dates = [];
                let deceaseQtyIncremental = 0;
                let quantity = 0;
                let insert;
                let sale; // TODO combine inserts and sales and create inventory service
                let decease: FlockDecease;

                while (growthDayTotal--) {

                    insert = inserts.find(insrt => {
                        return moment(insrt.createDate).isSame(deceaseDate, 'day');
                    }) || {};

                    // TODO should we reduce total quantity with sales? the decease rate might be affected
                    sale = sales
                        .find(_sale => moment(_sale.date).isSame(deceaseDate, 'day')) || {};

                    decease = deceases
                        .find(dcs => moment(dcs.deceaseDate).isSame(deceaseDate, 'day'));

                    decease = decease || new FlockDecease({
                        deceaseDate: deceaseDate.toDate(),
                        quantity: 0,
                        flock: flockId
                    });

                    deceaseQtyIncremental += decease.quantity;
                    quantity = Math.max(quantity +  (insert.quantity || 0) - decease.quantity - (sale.quantity || 0), 0);

                    dates.push({
                        day: day,
                        decease: decease,
                        deceaseQtyIncremental: deceaseQtyIncremental,
                        deceaseRateMarket: 0,
                        quantity: quantity,
                        isLastWeekDay: (day % 7) === 0
                    });

                    // Increments
                    day++;
                    deceaseDate.add(1, 'day');
                }

                return dates;
            })
            .do(dates => console.log('dates', dates))
            .combineLatest(this.marketDeceaseRates, (dates, marketDeceaseRates) => dates
                .map(date => {
                    let marketDeceaseRate = marketDeceaseRates.find(mdr => mdr.day === date.day) || {} as MarketDeceaseRate;
                    date.deceaseRateMarket = marketDeceaseRate.rate || date.deceaseRateMarket;
                    return date;
                })
            )
            .subscribe(dates => this.zone.run(() =>
                this.dates = dates
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
