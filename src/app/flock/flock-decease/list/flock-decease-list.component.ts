import { Component, OnInit } from '@angular/core';
import { FlockInsertsService } from '../../shared/flock-inserts.service';

@Component({
    selector: 'app-flock-decease-list',
    templateUrl: './flock-decease-list.component.html',
    styleUrls: ['./flock-decease-list.component.scss']
})
export class FlockDeceaseListComponent implements OnInit {

    hasInserts: boolean = false;

    constructor(
        private flockInsertsService: FlockInsertsService
    ) { }

    ngOnInit() {

        this.flockInsertsService.flockInserts
            .map(inserts => Boolean(inserts.length))
            .subscribe(hasInserts => this.hasInserts = hasInserts);

    }

}
