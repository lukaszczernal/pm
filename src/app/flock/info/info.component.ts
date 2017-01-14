import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlockService } from '../../farm/shared/flock.service';
import { Flock } from '../../farm/shared/flock.model';

@Component({
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {

    model: Flock;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private flockService: FlockService
    ) {}

    ngOnInit() {
        this.route.params
            .map(params => params['id'])
            .do(() => console.log('info component - route params'))
            .switchMap(id => this.flockService.get(id))
            .subscribe(flock => this.model = flock);

        this.flockService.update
            .subscribe(() => this.exit());

    }

    save(formData) {
        this.model.update(formData);
        this.flockService.update.next(this.model);
    }

    cancel() {
        this.exit();
    }

    exit() {
        this.router.navigate(['../'], {relativeTo: this.route});
    }

}
