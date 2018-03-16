import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { FlockFodder } from '../../../models/flock-fodder.model';
import { FlockFodderService } from '../../shared/flock-fodder.service';
import { BaseForm } from '../../shared/base-form';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/partition';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/withLatestFrom';
import { FlockService } from 'app/shared/service/flock.service';

@Component({
  selector: 'app-flock-fodder-details',
  templateUrl: './flock-fodder-details.component.html',
  styleUrls: ['./flock-fodder-details.component.scss']
})
export class FlockFodderDetailsComponent extends BaseForm implements OnInit {
    private newFodder: Observable<FlockFodder>;
    private currentFodder: Observable<FlockFodder>;

    private onEdit: Observable<string>;
    private onAdd: Observable<string>;

    public model: Observable<FlockFodder>;

    constructor(
        private flockFodderService: FlockFodderService,
        private flockService: FlockService,
        route: ActivatedRoute,
        router: Router
    ) {
        super(router, route);
    }

    ngOnInit() {

        console.count('FlockFodderDetails Component - OnInit');

        [this.onEdit, this.onAdd] = this.route.paramMap
            .map(params => params.get('flockFodderId'))
            .partition(id => Boolean(id));

        this.currentFodder = this.onEdit
            .do((flockId) => console.log('flock fodder details - route', flockId))
            .flatMap(id => this.flockFodderService.get(id));

        this.newFodder = this.onAdd
            .withLatestFrom(this.route.paramMap, (trigger, params) => params.get('timestamp'))
            .do(date => console.log('flock fodder details - new fodder by date: ', date))
            .map(timestamp => parseInt(timestamp, 10) || 0)
            .map(timestamp => timestamp ? new Date(timestamp) : new Date())
            .map(date => new FlockFodder({ date }));

        this.model = Observable.merge(this.currentFodder, this.newFodder)
            .do(fodder => console.log('flock fodder details - fodder', fodder))
            .publishReplay(1)
            .refCount();

        this.submit
            .filter(form => form.invalid)
            .map(form => form.controls)
            .do(() => console.log('flock fodder details - submit error'))
            .subscribe(this.showValidationMsg);

        this.submit
            .filter(form => form.valid)
            .map(form => form.value)
            .withLatestFrom(this.flockService.currentFlockId, (form, flockId) => {
                form.flock = form.flock || flockId;
                return form;
            })
            .do(model => console.log('flock fodder details - submit valid', model))
            .withLatestFrom(this.model, (form, model) => model.update(form))
            .subscribe(this.flockFodderService.update);

        // TODO if we have a timestamp we should direct user to nutrition list
        this.flockFodderService.update
            .subscribe(() => this.exit());

    }

    onSubmit(form: any) {
        this.submit.next(form);
    }

}


