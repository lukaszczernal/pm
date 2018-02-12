import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FlockSales } from '../../../models/flock-sales.model';
import { FlockSalesService } from '../../shared/flock-sales.service';
import { BaseForm } from '../../shared/base-form';
import { Observable } from 'rxjs/Observable';
import { FlockService } from '../../flock.service';


@Component({
  selector: 'app-flock-sales-details',
  templateUrl: './flock-sales-details.component.html',
  styleUrls: ['./flock-sales-details.component.scss']
})
export class FlockSalesDetailsComponent extends BaseForm implements OnInit {


    public model: Observable<FlockSales>;

    private currentItemId: Observable<number>;
    private currentItem: Observable<FlockSales>;

    constructor(
        private flockService: FlockService,
        private flockSalesService: FlockSalesService,
        route: ActivatedRoute,
        router: Router
    ) {
        super(router, route);
    }

    ngOnInit() {

        console.count('FlockInsertDetails Component - OnInit');

        this.currentItemId = this.route.params
            .filter(params => Boolean(params['flockSaleId']))
            .map(params => params['flockSaleId'])
            .do(itemId => console.log('flock sale details - route', itemId));

        this.currentItem = this.currentItemId
            .do(treatmentId => console.log('flock sale id', treatmentId))
            .flatMap(id => this.flockSalesService.get(id));

        this.model = this.currentItem
            .startWith(new FlockSales({}))
            .do((flock) => console.log('flock sale details', flock))
            .publishReplay(1)
            .refCount();

        this.submit
            .filter(form => form.invalid)
            .map(form => form.controls)
            .do(() => console.log('flock sale details - submit error'))
            .subscribe(this.showValidationMsg);

        this.submit
            .filter(form => form.valid)
            .map(form => form.value)
            .withLatestFrom(this.flockService.currentFlockId, (form, flockId) => {
                form.flock = form.flock || flockId;
                return form;
            })
            .withLatestFrom(this.model, (form, model) => model.update(form))
            .do(model => console.log('flock sale details - submit valid', model))
            .subscribe(this.flockSalesService.update);

        this.flockSalesService.update
            .subscribe(() => this.exit());

        // this.model = new FlockSales({});

        // this.route.params
        //     .filter(params => Boolean(params['flockSaleId']))
        //     .map(params => params['flockSaleId'])
        //     .do((flockId) => console.log('flock sales details - route', flockId))
        //     .flatMap(id => this.flockSalesService.get(id))
        //     .subscribe(this.currentSale);

        // this.currentSale
        //     .do((flock) => console.log('flock sales details - insert', flock))
        //     .subscribe(sale => this.ngZone.run(() => {
        //         this.model = new FlockSales(sale);
        //     }));

        // this.submit
        //     .filter(form => form.invalid)
        //     .map(form => form.controls)
        //     .do(() => console.log('flock sales details - submit error'))
        //     .subscribe(this.showValidationMsg);

        // this.submit
        //     .filter(form => form.valid) // TODO this is being triggered twice after hitting submit button
        //     .map(form => this.model.update(form.value))
        //     .map(model => this.updateFlockId(model)) // TODO check if this is still required - now we have hidden fields
        //     .do(model => console.log('flock sales details - submit valid', model))
        //     .subscribe(this.flockSalesService.update);

        // this.flockSalesService.update
        //     .subscribe(() => this.exit());

    }

    // private updateFlockId(model: FlockSales): FlockSales {
    //     model.flock = this.route.snapshot.params['id'];
    //     return model;
    // }

}

