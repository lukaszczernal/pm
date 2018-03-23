import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FlockHealth } from '../../../models/flock-health.model';
import { FlockHealthService } from '../flock-health.service';
import { BaseForm } from '../../shared/base-form';
import { Observable } from 'rxjs/Observable';
import { FlockService } from 'app/shared/service/flock.service';
import { FlockCostType } from '../../../models/flock-cost-type.model';
import { FlockCostTypesDbService } from '../../../shared/service/flock-cost-types-db.service';

@Component({
  selector: 'app-flock-health-details',
  templateUrl: './flock-health-details.component.html',
  styleUrls: ['./flock-health-details.component.scss']
})
export class FlockHealthDetailsComponent extends BaseForm implements OnInit {

    public model: Observable<FlockHealth>;
    public costTypes: Observable<FlockCostType[]>;

    private currentTreatmentId: Observable<number>;
    private currentTreatment: Observable<FlockHealth>;

    constructor(
        private flockHealthService: FlockHealthService,
        private flockCostTypes: FlockCostTypesDbService,
        private flockService: FlockService,
        route: ActivatedRoute,
        router: Router
    ) {
        super(router, route);
    }

    ngOnInit() {

        console.count('FlockFodderDetails Component - OnInit');

        this.currentTreatmentId = this.route.params
            .filter(params => Boolean(params['flockHealthId']))
            .map(params => params['flockHealthId'])
            .do((flockId) => console.log('flock health details - route', flockId));

        this.currentTreatment = this.currentTreatmentId
            .do(treatmentId => console.log('flock treatment id', treatmentId))
            .flatMap(id => this.flockHealthService.get(id));

        this.costTypes = this.flockCostTypes.getAll();

        this.model = this.currentTreatment
            .startWith(new FlockHealth({}))
            .do((flock) => console.log('flock treatment details', flock))
            .publishReplay(1)
            .refCount();

        this.submit
            .filter(form => form.invalid)
            .map(form => form.controls)
            .do(() => console.log('flock health details - submit error'))
            .subscribe(this.showValidationMsg);

        this.submit
            .filter(form => form.valid)
            .map(form => form.value)
            .withLatestFrom(this.flockService.currentFlockId, (form, flockId) => {
                form.flock = form.flock || flockId;
                return form;
            })
            .withLatestFrom(this.model, (form, model) => model.update(form))
            .do(model => console.log('flock health details - submit valid', model))
            .subscribe(this.flockHealthService.update);

        this.flockHealthService.update
            .subscribe(() => this.exit());

    }

}


