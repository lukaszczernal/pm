import { Component, OnInit } from '@angular/core';
import { FlockInsertsService } from '../shared/flock-inserts.service';
import { FlockWeightService } from '../shared/flock-weight.service';
import { FlockWeight } from '../../models/flock-weight.model';
import { Observable } from 'rxjs/Observable';
import { FlockDatesWeight } from 'app/models/flock-dates-weight.model';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-flock-weight',
  templateUrl: './flock-weight.component.html',
  styleUrls: ['./flock-weight.component.scss']
})
export class FlockWeightComponent implements OnInit {

    hasInserts: Observable<boolean>;
    items: Observable<MatTableDataSource<FlockDatesWeight>>;
    displayedColumns: string[];

    constructor(
        private flockInsertsService: FlockInsertsService,
        private flockWeightService: FlockWeightService,
    ) { }

   ngOnInit() {

        // TOOD when inserts are deleted we need to remove any affected decease data

        this.displayedColumns = ['day', 'date', 'weight', 'marketWeight', 'weightDeviation', 'increment', 'weightTotal'];

        this.hasInserts = this.flockInsertsService.hasInserts
            .do(() => console.log('flock weight list - hasinserts'));

        this.items = this.flockWeightService.weights
            .do(r => console.log('flock weight list', r))
            .map(items => new MatTableDataSource(items));

    }

    onItemChange(form) {
        if (form.dirty) {
            const item = new FlockWeight(form.value);
            (isNaN(item.value) || item.value === null) ?
                this.flockWeightService.remove.next(item) : this.flockWeightService.update.next(item);
        }
    }

}

