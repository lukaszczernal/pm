import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { FlockSalesService } from '../../shared/flock-sales.service';
import { FlockSales } from '../../../models/flock-sales.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-flock-sales-list',
    templateUrl: './flock-sales-list.component.html',
    styleUrls: ['./flock-sales-list.component.scss']
})
export class FlockSalesListComponent implements OnInit, OnDestroy {

    public sales: FlockSales[] = null;

    private salesSub: Subscription;

    constructor(
        private flockSalesService: FlockSalesService,
        private zone: NgZone
    ) { }

    ngOnInit() {
        console.count('Flock Sales List - OnInit');

        this.salesSub = this.flockSalesService.sales
            .do((sales) => console.log('Flock Sales List Component - sales', sales))
            .subscribe(sales => this.zone.run(() => this.sales = sales));
    }

    ngOnDestroy() {
        this.salesSub.unsubscribe();
    }

    delete(id: number) {
        this.flockSalesService.remove.next(id);
    }
}
