import { Injectable } from '@angular/core';
import { FlockSales } from '../../models/flock-sales.model';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { DatabaseService } from '../../shared/database.service';
import { FlockService } from '../flock.service';

@Injectable()
export class FlockSalesService {

    public sales: ReplaySubject<FlockSales[]> = new ReplaySubject(1);
    public update: Subject<FlockSales> = new Subject();
    public refresh: Subject<number> = new Subject();
    public remove: Subject<number> = new Subject();

    constructor(
        private databaseService: DatabaseService,
        private flockService: FlockService
    ) {
        console.count('FlockSalesService constructor');

        this.refresh
            .do(fid => console.log('flock sales service - refresh - flockID:', fid))
            .flatMap(flockId => this.getByFlock(flockId))
            .subscribe(this.sales);

        this.flockService.currentFlockId
            .do((id) => console.log('flock sales service - currentFlockId:', id))
            .subscribe(this.refresh);

        this.update
            .flatMap(sale => this.updateDB(sale))
            .switchMap(() => this.flockService.currentFlockId)
            .subscribe(this.refresh);

        this.remove
            .do((iid) => console.log('flock sales service - remove id:', iid))
            .flatMap(saleId => this.removeDB(saleId))
            .flatMap(() => this.flockService.currentFlockId)
            .subscribe(this.refresh);

    }

    private getByFlock(flockId: number): Observable<FlockSales[]> {
        return this.databaseService.connect()
            .map((db) => {
                let table = db.getSchema().table(FlockSales.TABLE_NAME);
                return db.select()
                    .from(table)
                    .where(table['flock'].eq(flockId));
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .map((sales: FlockSales[]) => FlockSales.parseRows(sales))
            .do(sales => console.log('flock sales service - getByFlock - sales:', sales));
    }

    get(id): Observable<FlockSales> {
        return this.sales
            .do(f => console.log('flock sales service - get', id, f.length))
            .flatMap(sales => sales)
            .filter(sale => sale.id === parseInt(id, 10));
    }

    private updateDB(sale: FlockSales): Observable<Object[]> {
        return this.databaseService.connect()
            .map(db => {
                let table = db.getSchema().table(FlockSales.TABLE_NAME);
                return db
                    .insertOrReplace()
                    .into(table)
                    .values([table.createRow(sale.toRow())]);
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .do((item) => console.log('flock sales service - update', item));
    }

    private removeDB(id: number): Observable<any> {
        return this.databaseService.connect()
            .map(db => {
                let table = db.getSchema().table(FlockSales.TABLE_NAME);
                return db
                    .delete()
                    .from(table)
                    .where(table['id'].eq(id));
            })
            .flatMap(query => Observable.fromPromise(query.exec()))
            .do(f => console.log('flock sales service - removeDB', f));
    }

}
