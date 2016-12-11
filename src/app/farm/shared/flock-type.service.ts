import { Injectable, NgZone } from '@angular/core';
import * as lf from 'lovefield';
import { FlockType } from './flock-type.model';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { DatabaseService } from '../../shared/database.service';

@Injectable()
export class FlockTypeService {

    private db: any; // TODO typing

    private _flockTypes: BehaviorSubject<FlockType[]> = new BehaviorSubject([] as FlockType[]);
    private add: Subject<any> = new Subject<any>();

    private create: Subject<FlockType> = new Subject<FlockType>();

    public flockTypes: Observable<FlockType[]>;

    constructor(
        private databaseService: DatabaseService,
        private ngZone: NgZone
    ) {

        this.flockTypes = this._flockTypes;

        this.db = this.databaseService.connect();

        this.create
            .flatMap((flockType) => this.insert(flockType))
            .subscribe(this.add);

        this.add
            .map(flockType => {
                let types = this._flockTypes.getValue();
                this._flockTypes.next(types.concat(flockType));
            });

        // this.populate();
    }

    getAll(): Observable<FlockType[]> {
        return this.db
            .switchMap((db) => {
                let table = db.getSchema().table(FlockType.TABLE_NAME);
                return db.select()
                    .from(table)
                    .orderBy(table['name'], lf.Order.ASC)
                    .exec();
            })
            .map(flockTypes => FlockType.parseRows(flockTypes))
            .map(flockTypes => this.ngZone.run(() => {
                this._flockTypes.next(flockTypes);
            }))
            .toPromise();
    }

    insert(flockType: FlockType): Observable<Object[]> { // TODO move to base
        return this.db
            .switchMap((db) => {
                let table = db.getSchema().table(FlockType.TABLE_NAME);
                return db.insert()
                    .into(table)
                    .values([table.createRow(flockType.toRow())])
                    .exec();
            })
            .map(() => flockType);
    }

    // private populate() {
    //     this.create.next(new FlockType({ id: 1, breedingPeriod: 42, name: 'Brojler' }));
    //     this.create.next(new FlockType({ id: 2, breedingPeriod: 96, name: 'Indyk' }));
    // }

}
