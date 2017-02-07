import * as lf from 'lovefield';
import { BaseModel } from '../shared/base.model';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export class FlockFodder extends BaseModel {

    static TABLE_NAME = 'FlockFodder';

    ngbDate: NgbDateStruct;
    date: Date;
    quantity: number;
    price: number;
    type: string;
    provider: string;
    flock: number;
    id: number;

    public static parseRows(rows: Object[]): FlockFodder[] { // TODO move to base model
        return rows.map(row => new FlockFodder(row));
    }

    public static createTable(schemaBuilder) {
        schemaBuilder.createTable(FlockFodder.TABLE_NAME)
            .addColumn('date', lf.Type.DATE_TIME)
            .addColumn('quantity', lf.Type.INTEGER)
            .addColumn('price', lf.Type.NUMBER)
            .addColumn('type', lf.Type.STRING)
            .addColumn('provider', lf.Type.STRING)
            .addColumn('flock', lf.Type.INTEGER)
            .addColumn('id', lf.Type.INTEGER)
            .addForeignKey('fk_flock', {
                local: 'flock',
                ref: 'Flock.id',
                action: lf.ConstraintAction.CASCADE
            })
            .addPrimaryKey(['id'], true);
    }

    update(data): FlockFodder {
        Object.assign(this, data);

        if (data.date) {
            this.ngbDate = this.toNgbDate(this.date);
        }
        if (data.ngbDate) {
            this.date = this.fromNgbDate(data.ngbDate);
        }

        return this;
    }


}
