import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { FlockHealth } from '../../../models/flock-health.model';
import { FlockHealthService } from '../flock-health.service';
import { BaseForm } from '../../shared/base-form';

@Component({
  selector: 'app-flock-health-details',
  templateUrl: './flock-health-details.component.html',
  styleUrls: ['./flock-health-details.component.scss']
})
export class FlockHealthDetailsComponent extends BaseForm implements OnInit {

    @ViewChild('form') form: NgForm;

    model: FlockHealth;

    private currentHealth: ReplaySubject<FlockHealth> = new ReplaySubject(1);

    constructor(
        private flockHealthService: FlockHealthService,
        private zone: NgZone,
        route: ActivatedRoute,
        router: Router
    ) {
        super(router, route);
    }

    ngOnInit() {

        console.count('FlockFodderDetails Component - OnInit');

        this.model = new FlockHealth({});

        this.route.params
            .filter(params => Boolean(params['flockHealthId']))
            .map(params => params['flockHealthId'])
            .do((flockId) => console.log('flock health details - route', flockId))
            .flatMap(id => this.flockHealthService.get(id))
            .subscribe(this.currentHealth);

        this.currentHealth
            .do(item => console.log('flock health details - item', item))
            .subscribe(item => this.zone.run(() => {
                this.model = new FlockHealth(item);
            }));

        this.submit
            .filter(form => form.invalid)
            .map(form => form.controls)
            .do(() => console.log('flock health details - submit error'))
            .subscribe(this.showValidationMsg);

        this.submit
            .filter(form => form.valid) // TODO this is being triggered twice after hitting submit button
            .map(form => this.model.update(form.value))
            .map(model => this.updateFlockId(model)) // TODO check if this is still required - now we have hidden fields
            .do(model => console.log('flock health details - submit valid', model))
            .subscribe(this.flockHealthService.update);

        this.flockHealthService.update
            .subscribe(() => this.exit());

    }

    private updateFlockId(model: FlockHealth): FlockHealth {
        model.flock = this.route.snapshot.params['id'];
        return model;
    }

}


