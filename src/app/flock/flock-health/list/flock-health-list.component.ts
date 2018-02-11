import { Component, OnInit } from '@angular/core';
import { FlockHealthService } from '../flock-health.service';
import { FlockHealth } from '../../../models/flock-health.model';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ConfirmationDialogComponent } from 'app/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  templateUrl: './flock-health-list.component.html',
  styleUrls: ['./flock-health-list.component.scss']
})
export class FlockHealthListComponent implements OnInit {

    public items: Observable<MatTableDataSource<FlockHealth>>;
    public displayedColumns: string[];
    public hasItems: Observable<boolean>;

    private delete: Subject<number> = new Subject();

    constructor(
        private health: FlockHealthService,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        console.count('Flock Health List - OnInit');

        this.displayedColumns = ['date', 'type', 'description', 'cost', 'actions'];

        this.items = this.health.items
            .do((items) => console.log('Flock Health List Component - health items', items))
            .map(items => new MatTableDataSource(items))
            .startWith(new MatTableDataSource([]));

        this.hasItems = this.items
            .map(dataSource => dataSource.data.length > 0);

        this.delete
            .map(id => ({
                data: { id, question: 'Czy napewno chcesz usunąć wpis o zabiegu?' }
            }))
            .mergeMap(config => this.dialog.open(ConfirmationDialogComponent, config).afterClosed())
            .filter(result => Boolean(result))
            .subscribe(this.health.remove); // TODO unsubscribe

    }

    showDeleteDialog(id: number) {
        this.delete.next(id);
    }

}
