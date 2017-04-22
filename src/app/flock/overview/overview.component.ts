import { Component, OnInit, NgZone } from '@angular/core';
import { FlockQuantityService } from 'app/flock/shared/flock-quantity.service';
import { FlockService } from 'app/flock/flock.service';
import { Observable } from 'rxjs/Observable';
import { FlockFodderQuantityService } from 'app/flock/shared/flock-fodder-quantity.service';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

    currentQuantity: number;
    flockType: string;
    remainingFodderQuantity: number;

    constructor(
        private zone: NgZone,
        private flockService: FlockService,
        private flockQuantity: FlockQuantityService,
        private flockFodderQuantity: FlockFodderQuantityService
    ) {
        this.remainingFodderQuantity = 0;
    }

    ngOnInit() {

         this.flockQuantity.currentQuantity
            .subscribe(quantity =>
                this.zone.run(() => this.currentQuantity = quantity.total)
            );

        this.flockService.currentFlockType
            .subscribe(type =>
                this.zone.run(() => this.flockType = type.name)
            );

        this.flockFodderQuantity.currentFodderQuantity
            .subscribe(quantity =>
                this.zone.run(() => this.remainingFodderQuantity = quantity)
            );

    }

}
