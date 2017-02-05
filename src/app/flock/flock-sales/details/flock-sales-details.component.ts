import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, ReplaySubject } from 'rxjs';
import { FlockSales } from '../../../models/flock-sales.model';
import { FlockSalesService } from '../../shared/flock-sales.service';


@Component({
  selector: 'app-flock-sales-details',
  templateUrl: './flock-sales-details.component.html',
  styleUrls: ['./flock-sales-details.component.scss']
})
export class FlockSalesDetailsComponent implements OnInit {

    @ViewChild('form') form: NgForm;

    model: FlockSales;

    private submit: Subject<any> = new Subject();

    private currentSale: ReplaySubject<FlockSales> = new ReplaySubject(1);

    constructor(
        private ngZone: NgZone,
        private router: Router,
        private route: ActivatedRoute,
        private flockSalesService: FlockSalesService
    ) {}

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
            .map(model => this.updateFlockId(model))
            .do(model => console.log('flock sales details - submit valid', model))
            .subscribe(this.flockSalesService.update);

        this.flockSalesService.update
            .subscribe(() => this.exit());

    }

    onSubmit(form: any) { // TODO move to base form component class
        this.submit.next(form);
    }

    onCancel() { // TODO move to base form component class
        this.exit();
    }

    errorMsgVisible(field): boolean { // TODO move to base form component class
        if (field) {
            return field.invalid && field.dirty;
        } else {
            return false;
        }
    }

    private updateFlockId(model: FlockSales): FlockSales {
        model.flock = this.route.snapshot.params['id'];
        return model;
    }

    private exit() { // TODO move to base form component class
        this.router.navigate(['../'], {relativeTo: this.route});
    }

    private showValidationMsg(controls) { // TODO move to base form component class
        for (let key in controls) {
            if (controls.hasOwnProperty(key)) {
                let control = controls[key];
                control.markAsDirty();
                if (control instanceof FormGroup) {
                    this.showValidationMsg(control.controls);
                }
            }
        }
    }

}

