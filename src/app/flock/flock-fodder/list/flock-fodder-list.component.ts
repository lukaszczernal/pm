import { Component, OnInit } from '@angular/core';
import { FlockFodderService } from '../../shared/flock-fodder.service';
import { FlockFodder } from '../../../models/flock-fodder.model';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-flock-fodder-list',
  templateUrl: './flock-fodder-list.component.html',
  styleUrls: ['./flock-fodder-list.component.scss']
})
export class FlockFodderListComponent implements OnInit {

    public displayedColumns: string[];
    public fodderPurchases: Observable<MatTableDataSource<FlockFodder>>;

    constructor(
        private flockFodderService: FlockFodderService
    ) { }

    ngOnInit() {
        console.count('Flock Sales List - OnInit');

        this.displayedColumns = ['date', 'type', 'provider', 'quantity', 'price', 'value'];

        this.fodderPurchases = this.flockFodderService.fodders
            .do((fodders) => console.log('Flock Fodder List Component - fodder', fodders))
            .map(fodders => new MatTableDataSource<FlockFodder>(fodders));
    }

    delete(id: number) {
        this.flockFodderService.remove.next(id);
    }

}
