import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { DatabaseService } from '../shared/database.service';
import { FlockService } from '../flock/shared/flock.service';
import { Flock } from '../flock/shared/flock.model';

@Component({
  selector: 'app-farm',
  templateUrl: './farm.component.html'
})
export class FarmComponent implements OnInit, OnDestroy {

    public flocks: Flock[];

    constructor(
        private databaseService: DatabaseService,
        private flockService: FlockService,
        private ngZone: NgZone
    ) {}

    ngOnInit() {
        this.databaseService.connect()
            .flatMap((database) => {
                this.flockService.init(database);

                const handler = (changes: Object[]) => {
                    this.ngZone.run(() => {
                        this.flocks = Flock.parseRows(changes.pop()['object']);
                    });
                };

                return this.flockService.observe(handler);
            })
            .subscribe((flockJson) => {
                this.ngZone.run(() => {
                    this.flocks = Flock.parseRows((flockJson));
                });
            });
    }

    ngOnDestroy() {
        this.flockService.unobserve();
    }

};
