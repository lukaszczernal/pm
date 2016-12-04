import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FlockService } from '../../farm/shared/flock.service';
import { Flock } from '../../farm/shared/flock.model';

@Component({
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

    model: Observable<Flock>;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private flockService: FlockService
    ) {}

    ngOnInit() {
        this.model = this.route.params
            .map(params => params['id'])
            .switchMap(id => this.flockService.get(id))
            .publishReplay(1)
            .refCount();
    }

    save(flock: Flock) {
        this.model
            .map(model => flock.id = model.id)
            .switchMap(() => this.flockService.update(flock))
            .toPromise()
            .then(this.exit.bind(this)); // TODO redirect to new flock menu
    }

    cancel() {
        this.exit();
    }

    exit() {
        this.router.navigate(['../'], {relativeTo: this.route});
    }

}
