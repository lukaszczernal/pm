import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { FlockFodderService } from '../../shared/flock-fodder.service';
import { FlockFodder } from '../../../models/flock-fodder.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-flock-fodder-list',
  templateUrl: './flock-fodder-list.component.html',
  styleUrls: ['./flock-fodder-list.component.scss']
})
export class FlockFodderListComponent implements OnInit, OnDestroy {

    public fodders: FlockFodder[] = null;

    private foddersSub: Subscription;

    constructor(
        private flockFodderService: FlockFodderService,
        private zone: NgZone
    ) { }

    ngOnInit() {
        console.count('Flock Sales List - OnInit');

        this.foddersSub = this.flockFodderService.fodders
            .do((fodders) => console.log('Flock Fodder List Component - fodder', fodders))
            .subscribe(fodders => this.zone.run(() => this.fodders = fodders));
    }

    ngOnDestroy() {
        this.foddersSub.unsubscribe();
    }

    delete(id: number) {
        this.flockFodderService.remove.next(id);
    }

}
