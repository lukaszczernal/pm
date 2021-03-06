import { Injectable } from '@angular/core';
import * as lf from 'lovefield';
import { FlockType } from '../../models/flock-type.model';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { DatabaseService } from '../../shared/database.service';

@Injectable()
export class FlockTypeService {

    private db: any; // TODO typing

    private _flockTypes: BehaviorSubject<FlockType[]> = new BehaviorSubject([] as FlockType[]);

    private add: Subject<any> = new Subject<any>();
    private create: Subject<FlockType> = new Subject<FlockType>();

    public flockTypes: Observable<FlockType[]>;

    constructor(
        private databaseService: DatabaseService
    ) {

        this.db = this.databaseService.connect();

        this.flockTypes = this.getAll()
            .do(() => console.log('flock type service - flock type'))
            .do(type => this._flockTypes.next(type))
            .switchMap(() => this._flockTypes)
            .publishReplay(1)
            .refCount();

        this.create
            .flatMap((flockType) => this.insert(flockType))
            .subscribe(this.add);

        this.add
            .map(flockType => {
                const types = this._flockTypes.getValue();
                return types.concat(flockType);
            })
            .subscribe((types) => this._flockTypes.next(types));
    }

    get(id): Observable<FlockType> {
        return this.flockTypes
            .map(types => types
                .find(type => type.id === parseInt(id, 10)))
            .filter(type => Boolean(type));
    }

    getAll(): Observable<FlockType[]> {
        return this.db
            .flatMap(db => {
                const table = db.getSchema().table(FlockType.TABLE_NAME);
                const query = db.select()
                    .from(table)
                    .orderBy(table['name'], lf.Order.ASC);

                return Observable.fromPromise(query.exec());
            })
            .do(() => console.log('flock type service - getAll'))
            .map(flockTypes => FlockType.parseRows(flockTypes));
    }


    insert(flockType: FlockType): Observable<Object[]> { // TODO move to base
        return this.db
            .switchMap((db) => {
                const table = db.getSchema().table(FlockType.TABLE_NAME);
                return db.insert()
                    .into(table)
                    .values([table.createRow(flockType.toRow())])
                    .exec();
            })
            .map(() => flockType);
    }

    private populate() {
        this.create.next(new FlockType({ id: 1, breedingPeriod: 42, name: 'Brojler' }));
        this.create.next(new FlockType({ id: 2, breedingPeriod: 96, name: 'Indyk' }));
    }

}
