import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { FlockFodder } from '../../../models/flock-fodder.model';
import { FlockFodderService } from '../../shared/flock-fodder.service';
import { BaseForm } from '../../shared/base-form';

@Component({
  selector: 'app-flock-fodder-details',
  templateUrl: './flock-fodder-details.component.html',
  styleUrls: ['./flock-fodder-details.component.scss']
})
export class FlockFodderDetailsComponent extends BaseForm implements OnInit {

    @ViewChild('form') form: NgForm;

    model: FlockFodder;

    private currentFodder: ReplaySubject<FlockFodder> = new ReplaySubject(1);

    constructor(
        private flockFodderService: FlockFodderService,
        private zone: NgZone,
        route: ActivatedRoute,
        router: Router
    ) {
        super(router, route);
    }

    ngOnInit() {

        console.count('FlockFodderDetails Component - OnInit');

        this.model = new FlockFodder({});

        this.route.params
            .filter(params => Boolean(params['flockFodderId']))
            .map(params => params['flockFodderId'])
            .do((flockId) => console.log('flock fodder details - route', flockId))
            .flatMap(id => this.flockFodderService.get(id))
            .subscribe(this.currentFodder);

        this.currentFodder
            .do(fodder => console.log('flock fodder details - fodder', fodder))
            .subscribe(fodder => this.zone.run(() => {
                this.model = new FlockFodder(fodder);
            }));

        this.submit
            .filter(form => form.invalid)
            .map(form => form.controls)
            .do(() => console.log('flock fodder details - submit error'))
            .subscribe(this.showValidationMsg);

        this.submit
            .filter(form => form.valid) // TODO this is being triggered twice after hitting submit button
            .map(form => this.model.update(form.value))
            .do(model => console.log('flock fodder details - submit valid', model))
            .subscribe(this.flockFodderService.update);

        this.flockFodderService.update
            .subscribe(() => this.exit());

    }

}


