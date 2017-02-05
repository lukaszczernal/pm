import * as lf from 'lovefield';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export class FlockInsert { // TODO extend Base Model

    static TABLE_NAME = 'FlockInsert';

    ngbCreateDate: NgbDateStruct;
    createDate: Date = new Date();
    quantity: number;
    flock: number;
    price: number;
    id: number;

    public static parseRows(rows: Object[]): FlockInsert[] { // TOOD move to base model
        let flocks: FlockInsert[] = [];
        for (let row of rows) {
            flocks.push(new FlockInsert(row));
        }
        return flocks;
    }

    public static createTable(schemaBuilder) {
        schemaBuilder.createTable(FlockInsert.TABLE_NAME)
            .addColumn('createDate', lf.Type.DATE_TIME)
            .addColumn('quantity', lf.Type.INTEGER)
            .addColumn('flock', lf.Type.INTEGER)
            .addColumn('price', lf.Type.NUMBER)
            .addColumn('id', lf.Type.INTEGER)
            .addForeignKey('fk_flock', {
                local: 'flock',
                ref: 'Flock.id',
                action: lf.ConstraintAction.CASCADE
            })
            .addPrimaryKey(['id'], true);
    }


    constructor(data) { // TODO move to base
        this.update(data);
    }

    update(data): FlockInsert {
        Object.assign(this, data);

        if (data.createDate) {
            this.ngbCreateDate = this.toNgbDate(this.createDate);
        }
        if (data.ngbCreateDate) {
            this.createDate = this.fromNgbDate(data.ngbCreateDate);
        }

        return this;
    }

    toRow(): Object {
        return Object.assign({}, this);
    }

    private toNgbDate(dateField: Date): NgbDateStruct {
        if (dateField) {
            return {
                year: dateField.getFullYear(),
                month: dateField.getMonth() + 1,
                day: dateField.getDate()
            };
        } else {
            return undefined;
        }
    }

    private fromNgbDate(data: NgbDateStruct): Date {
        return new Date(data.year, data.month - 1, data.day);
    }

}
