import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { FlockHealthService } from '../flock-health.service';
import { FlockHealth } from '../../../models/flock-health.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-flock-health-list',
  templateUrl: './flock-health-list.component.html',
  styleUrls: ['./flock-health-list.component.scss']
})
export class FlockHealthListComponent implements OnInit, OnDestroy {

    public items: FlockHealth[] = null;

    private healthSub: Subscription;

    constructor(
        private health: FlockHealthService,
        private zone: NgZone
    ) { }

    ngOnInit() {
        console.count('Flock Health List - OnInit');

        this.healthSub = this.health.items
            .do((items) => console.log('Flock Health List Component - health items', items))
            .subscribe(items => this.zone.run(() => this.items = items));
    }

    ngOnDestroy() {
        this.healthSub.unsubscribe();
    }

    delete(id: number) {
        this.health.remove.next(id);
    }

}
