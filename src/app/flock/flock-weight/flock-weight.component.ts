import { Component, OnInit } from '@angular/core';
import { FlockInsertsService } from '../shared/flock-inserts.service';
import { FlockWeightService } from '../shared/flock-weight.service';
import { FlockWeight } from '../../models/flock-weight.model';
import { Observable } from 'rxjs/Observable';
import { FlockDatesWeight } from 'app/models/flock-dates-weight.model';
import { MatTableDataSource } from '@angular/material';
import { FlockBreedingService } from '../shared/flock-breeding.service';
import { FlockBreedingDate } from '../../models/flock-breeding-date.model';
import { Subject } from 'rxjs/Subject';
import { FlockService } from '../flock.service';
import * as laylow from '../../helpers/lcdash';
import * as _ from 'lodash';

import 'rxjs/add/operator/partition';

@Component({
  selector: 'app-flock-weight',
  templateUrl: './flock-weight.component.html',
  styleUrls: ['./flock-weight.component.scss']
})
export class FlockWeightComponent implements OnInit {

    hasInserts: Observable<boolean>;
    items: Observable<MatTableDataSource<FlockBreedingDate>>;
    displayedColumns: string[];

    private weightInput: Subject<any> = new Subject();

    constructor(
        private flockInsertsService: FlockInsertsService,
        private flockWeightService: FlockWeightService,
        private flockBreeding: FlockBreedingService,
        private flock: FlockService
    ) { }

   ngOnInit() {
        // TOOD when inserts are deleted we need to remove any affected decease data

        this.displayedColumns = ['day', 'date', 'weight', 'marketWeight', 'weightDeviation', 'increment', 'weightTotal'];

        this.hasInserts = this.flockInsertsService.hasInserts;

        this.items = this.flockBreeding.breedingStore
            .map(dates => _.cloneDeep(dates)) // TODO immutable.js ?
            .switchMapTo(this.flockWeightService.collection, (dates, weights) => laylow
                .mergeJoin([dates, weights], 'date', 'date', 'weightId', 'id'))
            .map(items => new MatTableDataSource(items));

        const [removeWeightRecord, addWeightRecord] = this.weightInput
            .filter(form => form.dirty)
            .withLatestFrom(this.flock.currentFlockId)
            .map(([form, flock]) => ({ ...form.value, flock }))
            .map(data => new FlockWeight(data))
            .partition(item => isNaN(item.value) || item.value === null)

        removeWeightRecord
            .subscribe(this.flockWeightService.remove)

        addWeightRecord
            .subscribe(this.flockWeightService.update);

    }

    onItemChange(form) {
        this.weightInput.next(form);
    }

}

