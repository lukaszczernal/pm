import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { FlockService } from '../flock.service';
import { FlockInsertsService } from '../shared/flock-inserts.service';
import { FlockWeightService } from './flock-weight.service';
import { MarketWeightService } from '../../market/market-weight.service';
import { FlockInsert } from '../shared/flock-insert.model';
import { FlockTypeService } from '../../farm/shared/flock-type.service';
import { MarketWeight } from '../../models/market-weight.model';
import { FlockWeight } from '../../models/flock-weight.model';
import * as moment from 'moment';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-flock-weight',
  templateUrl: './flock-weight.component.html',
  styleUrls: ['./flock-weight.component.scss']
})
export class FlockWeightComponent implements OnInit, OnDestroy {

    hasInserts: boolean = false;
    items: FlockWeight[] = [];
    marketWeight: Observable<MarketWeight[]>;

    private listSub: Subscription;
    private hasInsertsSub: Subscription;

    constructor(
        private marketWeightService: MarketWeightService,
        private flockInsertsService: FlockInsertsService,
        private flockWeightService: FlockWeightService,
        private flockTypeService: FlockTypeService,
        private flockService: FlockService,
        private zone: NgZone
    ) { }

   ngOnInit() {

        // TOOD when inserts are deleted we need to remove any affected decease data

        this.hasInsertsSub = this.flockInsertsService.hasInserts
            .do(() => console.log('flock weight list - hasinserts'))
            .subscribe(hasInserts => this.hasInserts = hasInserts);

        this.marketWeight = this.flockService.currentFlockType
            .do(() => console.log('flock weight list - marketWeight'))
            .flatMap(flockType => this.marketWeightService.getByFlockType(flockType.id));

        this.listSub = this.flockService.currentFlockType
            .combineLatest(
                this.flockInsertsService.startDate,
                this.flockInsertsService.flockInserts,
                this.flockWeightService.collection,
                this.flockService.currentFlockId,
                 (flockType, startDate, inserts, weight, flockId) => [
                     flockType.breedingPeriod, startDate, inserts, weight, flockId])
            .map(([growthDayTotal, startDate, inserts, weights, flockId]: [
                number, Date, FlockInsert[], FlockWeight[], number]) => {
                let day = 1;
                let date = moment(startDate);
                let insert: FlockInsert;
                let weight: FlockWeight;
                let items = [];

                while (growthDayTotal--) {

                    insert = inserts.find(insrt => {
                        return moment(insrt.createDate).isSame(date, 'day');
                    }) || {} as FlockInsert;

                    weight = weights
                        .find(row => moment(row.date).isSame(date, 'day'));

                    weight = weight || {
                        date: date.toDate(),
                        flock: flockId
                    } as FlockWeight;

                    items.push({
                        day: day,
                        date: date,
                        weight: weight,
                        marketWeight: 0,
                        isLastWeekDay: (day % 7) === 0
                    });

                    // Increments
                    day++;
                    date.add(1, 'day');
                }

                return items;
            })
            .combineLatest(this.marketWeight, (list, marketWeights) => list
                .map(item => {
                    let _marketWeight = marketWeights.find(market => market.day === item.day) || {} as MarketWeight;
                    item.marketWeight = _marketWeight.value || item.marketWeight;
                    return item;
                })
            )
            .do(items => console.log('items', items))
            .subscribe(items => this.zone.run(() =>
                this.items = items
            ));

    }

    onItemChange(form) {
        if (form.dirty) {
            let item = new FlockWeight(form.value);
            this.flockWeightService.update.next(item);
        }
    }

    ngOnDestroy() {
        this.listSub.unsubscribe();
        this.hasInsertsSub.unsubscribe();
    }

}

