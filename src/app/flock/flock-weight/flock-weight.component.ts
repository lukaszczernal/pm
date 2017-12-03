import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { FlockService } from '../flock.service';
// import { FlockQuantityService } from 'app/flock/shared/flock-quantity.service';
import { FlockInsertsService } from '../shared/flock-inserts.service';
import { FlockWeightService } from '../shared/flock-weight.service';
import { MarketWeightService } from '../../market/market-weight.service';
// import { FlockDatesService } from 'app/flock/shared/flock-dates.service';
import { FlockTypeService } from '../../shared/service/flock-type.service';
import { MarketWeight } from '../../models/market-weight.model';
import { FlockWeight } from '../../models/flock-weight.model';
import * as moment from 'moment';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
// import * as laylow from '../../helpers/lcdash';

@Component({
  selector: 'app-flock-weight',
  templateUrl: './flock-weight.component.html',
  styleUrls: ['./flock-weight.component.scss']
})
export class FlockWeightComponent implements OnInit, OnDestroy {

    hasInserts: boolean = false;
    items: any[] = []; // TODO typings
    marketWeight: Observable<MarketWeight[]>;

    private listSub: Subscription;
    private hasInsertsSub: Subscription;

    constructor(
        // private flockQuantityService: FlockQuantityService,
        private marketWeightService: MarketWeightService,
        private flockInsertsService: FlockInsertsService,
        private flockWeightService: FlockWeightService,
        // private flockDatesService: FlockDatesService,
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

        this.listSub = this.flockWeightService.weights
            .subscribe(items => this.zone.run(() =>
                this.items = items
            ));

    }

    onItemChange(form) {
        if (form.dirty) {
            const item = new FlockWeight(form.value);
            (isNaN(item.value) || item.value === null) ?
                this.flockWeightService.remove.next(item) : this.flockWeightService.update.next(item);
        }
    }

    ngOnDestroy() {
        this.listSub.unsubscribe();
        this.hasInsertsSub.unsubscribe();
    }

}

