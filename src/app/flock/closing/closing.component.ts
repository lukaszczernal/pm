import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FlocksService } from '../../shared/service/flocks.service';
import { Flock } from '../../models/flock.model';
import { BaseForm } from '../shared/base-form';

@Component({
    selector: 'app-closing',
    templateUrl: './closing.component.html',
    styleUrls: ['./closing.component.scss']
})
export class ClosingComponent extends BaseForm implements OnInit {

    model: Flock;

    constructor(
        route: ActivatedRoute,
        router: Router,
        private flocksService: FlocksService,
        private zone: NgZone
    ) {
        super(router, route);
    }

    ngOnInit() {

        console.count('FlockClosing Component - OnInit');

        this.model = new Flock({});

        this.route.params
            .filter(params => Boolean(params['id'])) // TODO check if need this filter
            .map(params => params['id'])
            .do((flockId) => console.log('flock closing details - route', flockId))
            .flatMap(id => this.flocksService.get(id))
            .subscribe(flock => this.zone.run(() => {
                this.model = new Flock(flock);
            }));

        this.submit
            .filter(form => form.invalid)
            .map(form => form.controls)
            .do(() => console.log('flock closing details - submit error'))
            .subscribe(this.showValidationMsg);

        this.submit
            .filter(form => form.valid) // TODO this is being triggered twice after hitting submit button
            .map(form => this.model.update(form.value))
            .do(model => console.log('flock closing details - submit valid', model))
            .subscribe(this.flocksService.update);

        this.flocksService.update
            .subscribe(() => this.exit());

    }

}
