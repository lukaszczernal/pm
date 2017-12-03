import { Component, OnInit } from '@angular/core';
import { FlocksService } from 'app/shared/service/flocks.service';
import { Observable } from 'rxjs/Observable';
import { Flock } from 'app/models/flock.model';

@Component({
    selector: 'app-farm-menu',
    templateUrl: './farm-menu.component.html',
    styleUrls: ['./farm-menu.component.scss']
})
export class FarmMenuComponent implements OnInit {

    private activeFlocks: Observable<Flock[]>;
    private closedFlocks: Observable<Flock[]>;

    constructor(
        private flocksService: FlocksService
    ) { }

    ngOnInit() {
        this.activeFlocks = this.flocksService.activeFlocks;
        this.closedFlocks = this.flocksService.closedFlocks;
    }

}
