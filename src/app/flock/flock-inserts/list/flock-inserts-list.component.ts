import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlockInsert } from '../../../flock/shared/flock-insert.model';
import { FlockInsertsService } from '../../../flock/shared/flock-inserts.service';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { ConfirmationDialogComponent } from 'app/shared/confirmation-dialog/confirmation-dialog.component';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'app-flock-inserts-list',
    templateUrl: './flock-inserts-list.component.html',
    styleUrls: ['./flock-inserts-list.component.scss']
})
export class FlockInsertsListComponent implements OnInit {

    public insertsDataSource: Observable<MatTableDataSource<FlockInsert>>;
    public displayedColumns: string[];

    private delete: Subject<number> = new Subject();

    constructor(
        private flockInsertsService: FlockInsertsService,
        private route: ActivatedRoute,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        console.count('Flock Inserts List - OnInit');

        this.displayedColumns = ['date', 'quantity', 'weight', 'price', 'value', 'actions'];

        this.insertsDataSource = this.flockInsertsService.flockInserts
            .do((inserts) => console.log('Flock Insert List Component - Inserts', inserts))
            .map(inserts => new MatTableDataSource<FlockInsert>(inserts));

        this.delete
            .map(id => ({
                data: { id, question: 'Czy napewno chcesz usunąć wpis o wstaweniu?' }
            }))
            .mergeMap(config => this.dialog.open(ConfirmationDialogComponent, config).afterClosed())
            .filter(result => Boolean(result))
            .subscribe(this.flockInsertsService.remove);

    }

    showDeleteDialog(id: number) {
        this.delete.next(id);
    }

}
