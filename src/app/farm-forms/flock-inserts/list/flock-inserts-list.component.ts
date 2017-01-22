import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FlockInsert } from '../../../flock/shared/flock-insert.model';
import { FlockInsertsService } from '../../../flock/shared/flock-inserts.service';

@Component({
    selector: 'app-flock-inserts-list',
    templateUrl: './flock-inserts-list.component.html',
    styleUrls: ['./flock-inserts-list.component.scss']
})
export class FlockInsertsListComponent implements OnInit, OnDestroy {

    public inserts: FlockInsert[] = null;

    private insertsSub: Subscription;

    constructor(
        private flockInsertsService: FlockInsertsService,
        private route: ActivatedRoute,
        private zone: NgZone
    ) { }

    ngOnInit() {
        console.count('Flock Inserts List - OnInit');

        this.insertsSub = this.flockInsertsService.flockInserts
            .do((inserts) => console.log('Flock Insert List Component - Inserts', inserts))
            .subscribe(inserts => this.zone.run(() => this.inserts = inserts));
    }

    ngOnDestroy() {
        this.insertsSub.unsubscribe();
    }

    delete(id: number) {
        this.flockInsertsService.remove.next(id);
    }

}
