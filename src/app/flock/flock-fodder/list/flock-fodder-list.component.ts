import { Component, OnInit } from '@angular/core';
import { FlockFodderService } from '../../shared/flock-fodder.service';
import { FlockFodder } from '../../../models/flock-fodder.model';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { Subject } from 'rxjs/Subject';
import { ConfirmationDialogComponent } from 'app/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-flock-fodder-list',
  templateUrl: './flock-fodder-list.component.html',
  styleUrls: ['./flock-fodder-list.component.scss']
})
export class FlockFodderListComponent implements OnInit {

    public displayedColumns: string[];
    public fodderPurchases: Observable<MatTableDataSource<FlockFodder>>;

    private delete: Subject<number> = new Subject();

    constructor(
        private flockFodderService: FlockFodderService,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        console.count('Flock Sales List - OnInit');

        this.displayedColumns = ['date', 'type', 'provider', 'quantity', 'price', 'value', 'actions'];

        this.fodderPurchases = this.flockFodderService.fodders
            .do((fodders) => console.log('Flock Fodder List Component - fodder', fodders))
            .map(fodders => new MatTableDataSource<FlockFodder>(fodders));

        this.delete
            .map(id => ({
                data: { id, question: 'Czy napewno chcesz usunąć wpis o zakupie paszy?' }
            }))
            .mergeMap(config => this.dialog.open(ConfirmationDialogComponent, config).afterClosed())
            .filter(result => Boolean(result))
            .subscribe(this.flockFodderService.remove); // TODO unsubscribe
    }

    showDeleteDialog(id: number) {
        this.delete.next(id);
    }

}
