import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { FlockSales } from '../../../models/flock-sales.model';
import { FlockSalesService } from '../../shared/flock-sales.service';
import { BaseForm } from '../../shared/base-form';


@Component({
  selector: 'app-flock-sales-details',
  templateUrl: './flock-sales-details.component.html',
  styleUrls: ['./flock-sales-details.component.scss']
})
export class FlockSalesDetailsComponent extends BaseForm implements OnInit {

    @ViewChild('form') form: NgForm;

    model: FlockSales;

    private currentSale: ReplaySubject<FlockSales> = new ReplaySubject(1);

    constructor(
        private flockSalesService: FlockSalesService,
        private ngZone: NgZone,
        route: ActivatedRoute,
        router: Router
    ) {
        super(router, route);
    }

    ngOnInit() {

        console.count('FlockInsertDetails Component - OnInit');

        this.model = new FlockSales({});

        this.route.params
            .filter(params => Boolean(params['flockSaleId']))
            .map(params => params['flockSaleId'])
            .do((flockId) => console.log('flock sales details - route', flockId))
            .flatMap(id => this.flockSalesService.get(id))
            .subscribe(this.currentSale);

        this.currentSale
            .do((flock) => console.log('flock sales details - insert', flock))
            .subscribe(sale => this.ngZone.run(() => {
                this.model = new FlockSales(sale);
            }));

        this.submit
            .filter(form => form.invalid)
            .map(form => form.controls)
            .do(() => console.log('flock sales details - submit error'))
            .subscribe(this.showValidationMsg);

        this.submit
            .filter(form => form.valid) // TODO this is being triggered twice after hitting submit button
            .map(form => this.model.update(form.value))
            .map(model => this.updateFlockId(model)) // TODO check if this is still required - now we have hidden fields
            .do(model => console.log('flock sales details - submit valid', model))
            .subscribe(this.flockSalesService.update);

        this.flockSalesService.update
            .subscribe(() => this.exit());

    }

    private updateFlockId(model: FlockSales): FlockSales {
        model.flock = this.route.snapshot.params['id'];
        return model;
    }

}

