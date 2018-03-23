import { Component, OnInit } from '@angular/core';
import { FlockSalesService } from '../../shared/flock-sales.service';
import { FlockSales } from '../../../models/flock-sales.model';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'app-flock-sales-list',
    templateUrl: './flock-sales-list.component.html',
    styleUrls: ['./flock-sales-list.component.scss']
})
export class FlockSalesListComponent implements OnInit {

    public items: Observable<MatTableDataSource<FlockSales>>;
    public displayedColumns: string[];
    public hasItems: Observable<boolean>;

    private delete: Subject<number> = new Subject();

    constructor(
        private sales: FlockSalesService,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        console.count('Flock Health List - OnInit');

        this.displayedColumns = ['date', 'quantity', 'price', 'weight', 'avgWeight', 'value', 'customer', 'confiscation', 'edit', 'delete'];

        this.items = this.sales.items
            .do(items => console.log('Flock Sales List Component - sales', items))
            .map(items => new MatTableDataSource(items))
            .startWith(new MatTableDataSource([]));

        this.hasItems = this.items
            .map(dataSource => dataSource.data.length > 0);

        this.delete
            .map(id => ({
                data: { id, question: 'Czy napewno chcesz usunąć wpis o sprzedaży?' }
            }))
            .mergeMap(config => this.dialog.open(ConfirmationDialogComponent, config).afterClosed())
            .filter(result => Boolean(result))
            .subscribe(this.sales.remove); // TODO unsubscribe

    }

    showDeleteDialog(id: number) {
        this.delete.next(id);
    }

}
