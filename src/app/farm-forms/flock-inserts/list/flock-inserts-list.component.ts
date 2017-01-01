import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FlockInsert } from '../shared/flock-insert.model';
import { FlockInsertsService } from '../shared/flock-inserts.service';

@Component({
    selector: 'app-flock-inserts-list',
    templateUrl: './flock-inserts-list.component.html',
    styleUrls: ['./flock-inserts-list.component.scss']
})
export class FlockInsertsListComponent implements OnInit {

    public model: Observable<FlockInsert[]>;

    constructor(private flockInsertsService: FlockInsertsService) { }

    ngOnInit() {
        this.model = this.flockInsertsService.flockInserts;
        this.flockInsertsService.getAll().toPromise();
    }

}