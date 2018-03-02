import { Component, OnInit } from '@angular/core';``
import { FlockInsertsService } from '../../shared/flock-inserts.service';
import { FlockDeceaseService } from '../../shared/flock-decease.service';
import { FlockDeceaseItem } from '../../../models/flock-decease-item.model';
import { Observable } from 'rxjs/Observable';
import { FlockDecease } from 'app/models/flock-decease.model';
import { FlockDeceaseItemService } from 'app/flock/shared/flock-decease-item.service';
import { MatTableDataSource } from '@angular/material';

@Component({
    selector: 'app-flock-decease-list',
    templateUrl: './flock-decease-list.component.html',
    styleUrls: ['./flock-decease-list.component.scss']
})
export class FlockDeceaseListComponent implements OnInit {

    hasInserts: Observable<boolean>;
    items: Observable<MatTableDataSource<FlockDecease>>;
    displayedColumns: string[];

    constructor(
        private flockInsertsService: FlockInsertsService,
        private flockDeceaseItemService: FlockDeceaseItemService,
        private flockDeceaseService: FlockDeceaseService
    ) { }

    ngOnInit() {

        // TOOD when inserts are deleted we need to remove any affected decease data

        this.displayedColumns = ['day', 'date', 'decease', 'deceaseTotal', 'deceaseRate', 'marketDeceaseRate', 'flockQuantity'];

        this.hasInserts = this.flockInsertsService.hasInserts
            .do(() => console.log('flock decease list - hasinserts'));

        this.items = this.flockDeceaseService.deceases
            .map(items => new MatTableDataSource(items));
    }

    onDeceaseChange(deceaseForm) {
        if (deceaseForm.dirty) {
            const decease = new FlockDeceaseItem(deceaseForm.value);
            this.flockDeceaseItemService.update.next(decease);
        }
    }

}
