import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { FlockInsertsService } from '../../shared/flock-inserts.service';
import { FlockBreedingService } from '../../shared/flock-breeding.service';
import { FlockDeceaseItemService } from 'app/flock/shared/flock-decease-item.service';
import { FlockDeceaseItem } from '../../../models/flock-decease-item.model';
import { FlockDecease } from '../../../models/flock-decease.model';
import { Observable } from 'rxjs/Observable';
import { FlockBreedingDate } from '../../../models/flock-breeding-date.model';
import * as laylow from '../../../helpers/lcdash';
import * as _ from 'lodash';
import { Subject } from 'rxjs/Subject';
import { FlockService } from '../../../shared/service/flock.service';

@Component({
    selector: 'app-flock-decease-list',
    templateUrl: './flock-decease-list.component.html',
    styleUrls: ['./flock-decease-list.component.scss']
})
export class FlockDeceaseListComponent implements OnInit {

    hasInserts: Observable<boolean>;
    items: Observable<MatTableDataSource<FlockBreedingDate>>;
    displayedColumns: string[];

    private deceaseInput: Subject<any> = new Subject();

    constructor(
        private flockInsertsService: FlockInsertsService,
        private flockDeceaseItemService: FlockDeceaseItemService,
        private flockBreeding: FlockBreedingService,
        private flock: FlockService
    ) { }

    ngOnInit() {

        // TOOD when inserts are deleted we need to remove any affected decease data

        this.displayedColumns = ['day', 'date', 'decease', 'deceaseTotal', 'deceaseRate', 'marketDeceaseRate', 'flockQuantity'];

        this.hasInserts = this.flockInsertsService.hasInserts
            .do(() => console.log('flock decease list - hasinserts'));

        this.items = this.flockBreeding.breedingStore
            .map(dates => _.cloneDeep(dates))  // TODO immutable.js?
            .switchMapTo(this.flockDeceaseItemService.collection, (dates, deceases) => laylow
                .mergeJoin([dates, deceases], 'date', 'date', 'deceaseId', 'id'))
            .map(items => new MatTableDataSource(items));

        this.deceaseInput
            .filter(form => form.dirty)
            .withLatestFrom(this.flock.currentFlockId)
            .map(([form, flock]) => ({ ...form.value, flock }))
            .map(data => new FlockDeceaseItem(data))
            .subscribe(this.flockDeceaseItemService.update);
    }

    onDeceaseChange(form) {
        this.deceaseInput.next(form);
    }

}
