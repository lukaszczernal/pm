import { Component, OnInit } from '@angular/core';
import { FlocksService } from '../../shared/service/flocks.service';
import { Flock } from '../../models/flock.model';
import { Observable } from 'rxjs/Observable';
import { FlockTypeService } from '../../shared/service/flock-type.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

    public activeFlocks: Observable<Flock[]>;
    public closedFlocks: Observable<Flock[]>;

    constructor(
        private flocks: FlocksService,
        private flockTypes: FlockTypeService
    ) {}

    ngOnInit() {
        this.activeFlocks = this.flocks.activeFlocks;
        this.closedFlocks = this.flocks.closedFlocks;
    }

    getFlockTypeName(id: string): Observable<string> {
        return this.flockTypes.get(id)
            .map(type => type.name);
    }

}
