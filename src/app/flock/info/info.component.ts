import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlocksService } from '../../shared/service/flocks.service';
import { Flock } from '../../models/flock.model';
import { FlockService } from 'app/shared/service/flock.service';

@Component({
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

    model: Flock;

    constructor(
        private flock: FlockService,
        private router: Router,
        private route: ActivatedRoute,
        private flocksService: FlocksService
    ) {}

    ngOnInit() {
        this.flock.currentFlockId
            .switchMap(id => this.flocksService.get(id))
            .subscribe(flock => this.model = flock);

        this.flocksService.update
            .subscribe(() => this.exit());

    }

    save(formData) {
        this.model.update(formData);
        this.flocksService.update.next(this.model);
    }

    cancel() {
        this.exit();
    }

    exit() {
        this.router.navigate(['../'], {relativeTo: this.route});
    }

}
