import * as lf from 'lovefield';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { BaseModel } from '../../shared/base.model';

export class FlockDecease extends BaseModel {

    static TABLE_NAME = 'FlockDecease';

    ngbDate: NgbDateStruct;
    date: Date = new Date();
    quantity: number;
    flock: number;
    id: number;

    public static parseRows(rows: Object[]): FlockDecease[] { // TOOD move to base model
        return rows.map(row => new FlockDecease(row));
    }

    public static createTable(schemaBuilder) {
        schemaBuilder.createTable(FlockDecease.TABLE_NAME)
            .addColumn('date', lf.Type.DATE_TIME)
            .addColumn('quantity', lf.Type.INTEGER)
            .addColumn('flock', lf.Type.INTEGER)
            .addColumn('id', lf.Type.INTEGER)
            .addForeignKey('fk_flock', {
                local: 'flock',
                ref: 'Flock.id',
                action: lf.ConstraintAction.CASCADE
            })
            .addPrimaryKey(['id'], true);
    }

    update(data): FlockDecease {
        super.update(data);

        if (data.date) {
            this.ngbDate = this.toNgbDate(this.date);
        }
        if (data.ngbDate) {
            this.date = this.fromNgbDate(data.ngbDate);
        }

        return this;
    }

}
