import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlocksService } from '../../farm/shared/flocks.service';
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
        private flocksService: FlocksService
    ) {}

    ngOnInit() {
        this.route.params
            .map(params => params['id'])
            .do(() => console.log('info component - route params'))
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
