import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FlockInsert } from '../../../flock/shared/flock-insert.model';
import { FlockInsertsService } from '../../../flock/shared/flock-inserts.service';

@Component({
    selector: 'app-flock-inserts-list',
    templateUrl: './flock-inserts-list.component.html',
    styleUrls: ['./flock-inserts-list.component.scss']
})
export class FlockInsertsListComponent implements OnInit {

    public inserts: FlockInsert[] = null;
    private flockId: Observable<number>;

    constructor(
        private flockInsertsService: FlockInsertsService,
        private route: ActivatedRoute,
        private zone: NgZone
    ) { }

    ngOnInit() {

        this.flockInsertsService.flockInserts
            .subscribe(inserts => this.zone.run(() => this.inserts = inserts));

        this.flockId = this.route.params
            .map(params => params['id']);

        this.flockId
            .subscribe(this.flockInsertsService.setFlockId);

    }

    delete(id: number) {
        this.flockInsertsService.remove(id) // TODO add confiramtion
            .flatMap(() => this.flockId)
            .do(f => console.log('remove by flock Id', f))
            .subscribe(flockId => this.zone.run(() => this.flockInsertsService.setFlockId.next(flockId)));
    }

}
