import * as lf from 'lovefield';
import { BaseModel } from '../../shared/base.model';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export class Flock extends BaseModel {

    static TABLE_NAME = 'Flock';

    type: number;
    coopSize: number;
    coopName: string;
    name: string;
    createDate: Date;
    closeDate: Date;
    id: number;

    ngbCloseDate: NgbDateStruct;
    ngbCreateDate: NgbDateStruct;

    public static parseRows(rows: Object[]): Flock[] { // TOOD move to base model
        return rows.map(row => new Flock(row));
    }

    public static createTable(schemaBuilder) {
        schemaBuilder.createTable(Flock.TABLE_NAME)
            .addColumn('closeDate', lf.Type.DATE_TIME)
            .addColumn('createDate', lf.Type.DATE_TIME)
            .addColumn('type', lf.Type.INTEGER)
            .addColumn('coopSize', lf.Type.STRING)
            .addColumn('coopName', lf.Type.STRING)
            .addColumn('name', lf.Type.STRING)
            .addColumn('id', lf.Type.INTEGER)
            .addNullable([ 'coopName', 'closeDate' ])
            .addForeignKey('fk_type', {
                local: 'type',
                ref: 'FlockType.id',
                action: lf.ConstraintAction.CASCADE
            })
            .addPrimaryKey(['id'], true);
    }

    isActive(): boolean {
        return this.closeDate.getTime() <= 0 || this.closeDate.getTime() >= Date.now();
    }

    update(data): Flock {
        super.update(data);

        if (data.closeDate) {
            this.ngbCloseDate = this.toNgbDate(this.closeDate);
        }
        if (data.ngbCloseDate) {
            this.closeDate = this.fromNgbDate(data.ngbCloseDate);
        }

        return this;
    }

}
