import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlockInsert } from '../../../flock/shared/flock-insert.model';
import { FlockInsertsService } from '../../../flock/shared/flock-inserts.service';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource } from '@angular/material';

@Component({
    selector: 'app-flock-inserts-list',
    templateUrl: './flock-inserts-list.component.html',
    styleUrls: ['./flock-inserts-list.component.scss']
})
export class FlockInsertsListComponent implements OnInit {

    public insertsDataSource: Observable<MatTableDataSource<FlockInsert>>;
    public displayedColumns: string[];

    constructor(
        private flockInsertsService: FlockInsertsService,
        private route: ActivatedRoute,
        private zone: NgZone
    ) { }

    ngOnInit() {
        console.count('Flock Inserts List - OnInit');

        this.displayedColumns = ['date', 'quantity', 'weight', 'price', 'value', 'actions'];

        this.insertsDataSource = this.flockInsertsService.flockInserts
            .do((inserts) => console.log('Flock Insert List Component - Inserts', inserts))
            .map(inserts => new MatTableDataSource<FlockInsert>(inserts));

    }

    delete(id: number) {
        this.flockInsertsService.remove.next(id);
    }

}
