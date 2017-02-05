import * as lf from 'lovefield';
import { BaseModel } from '../shared/base.model';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export class FlockSales extends BaseModel {

    static TABLE_NAME = 'FlockSales';

    ngbDate: NgbDateStruct;
    date: Date;
    quantity: number;
    price: number;
    weight: number;
    flock: number;
    id: number;

    public static parseRows(rows: Object[]): FlockSales[] { // TOOD move to base model
        return rows.map(row => new FlockSales(row));
    }

    public static createTable(schemaBuilder) {
        schemaBuilder.createTable(FlockSales.TABLE_NAME)
            .addColumn('date', lf.Type.DATE_TIME)
            .addColumn('quantity', lf.Type.INTEGER)
            .addColumn('price', lf.Type.NUMBER)
            .addColumn('weight', lf.Type.INTEGER)
            .addColumn('flock', lf.Type.INTEGER)
            .addColumn('id', lf.Type.INTEGER)
            .addForeignKey('fk_flock', {
                local: 'flock',
                ref: 'Flock.id',
                action: lf.ConstraintAction.CASCADE
            })
            .addPrimaryKey(['id'], true);
    }

    update(data): FlockSales {
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
