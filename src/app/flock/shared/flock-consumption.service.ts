import { Injectable, NgZone } from '@angular/core';
import { FlockWeight } from '../../models/flock-weight.model';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { DatabaseService } from '../../shared/database.service';
import { FlockService } from 'app/shared/service/flock.service';

@Injectable()
export class FlockConsumptionService {

    public collection: Observable<FlockWeight[]>;
    public update: Subject<FlockWeight> = new Subject();
    public refresh: Subject<number> = new Subject();

    private _collection: ReplaySubject<FlockWeight[]> = new ReplaySubject(1);

    constructor(
        private databaseService: DatabaseService,
        private flockService: FlockService,
        private zone: NgZone
    ) {
        console.count('FlockConsumptionService constructor');

        // this.collection = this._collection.asObservable();

        // this.refresh
        //     .do(fid => console.log('flock weight service - refresh - flockID:', fid))
        //     .flatMap(flockId => this.getByFlock(flockId))
        //     .subscribe(this._collection);

        // this.flockService.currentFlockId
        //     .do((id) => console.log('flock weight service - currentFlockId:', id))
        //     .subscribe(this.refresh);

        // this.update
        //     .flatMap(flock => this.updateDB(flock))
        //     .switchMap(() => this.flockService.currentFlockId)
        //     .subscribe(this.refresh);

    }

    // private getByFlock(flockId: number): Observable<FlockWeight[]> {
    //     return this.databaseService.connect()
    //         .map((db) => {
    //             let table = db.getSchema().table(FlockWeight.TABLE_NAME);
    //             return db.select()
    //                 .from(table)
    //                 .where(table['flock'].eq(flockId));
    //         })
    //         .flatMap(query => Observable.fromPromise(query.exec()))
    //         .map((collection: FlockWeight[]) => FlockWeight.parseRows(collection))
    //         .do(weights => console.log('flock weight service - getByFlock - weights:', weights));
    // }

    // private updateDB(flockWeight: FlockWeight): Observable<Object[]> {
    //     return this.databaseService.connect()
    //         .map(db => {
    //             let table = db.getSchema().table(FlockWeight.TABLE_NAME);
    //             return db
    //                 .insertOrReplace()
    //                 .into(table)
    //                 .values([table.createRow(flockWeight.toRow())]);
    //         })
    //         .flatMap(query => Observable.fromPromise(query.exec()))
    //         .do((item) => console.log('flock weight service - update', item, flockWeight));
    // }

}
