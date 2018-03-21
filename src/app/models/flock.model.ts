import * as lf from 'lovefield';
import { BaseModel } from '../shared/base.model';
import { FlockAnalytics } from './flock-analytics.model';

export class Flock extends BaseModel {

    static TABLE_NAME = 'Flock';

    type: number;
    coopSize: number;
    coopName: string;
    name: string;
    description: string;
    createDate: Date = new Date();
    closeDate: Date;
    id: number;
    remainingFodder: number;
    lostFlocks: number;

    public static parseRows(rows: Object[]): Flock[] { // TOOD move to base model
        return rows.map(row => new Flock(row));
    }

    public static createTable(schemaBuilder) {
        schemaBuilder.createTable(Flock.TABLE_NAME)
            .addColumn('closeDate', lf.Type.DATE_TIME)
            .addColumn('createDate', lf.Type.DATE_TIME)
            .addColumn('type', lf.Type.INTEGER)
            .addColumn('coopSize', lf.Type.STRING)
            .addColumn('remainingFodder', lf.Type.INTEGER)
            .addColumn('lostFlocks', lf.Type.INTEGER)
            .addColumn('coopName', lf.Type.STRING)
            .addColumn('name', lf.Type.STRING)
            .addColumn('description', lf.Type.STRING)
            .addColumn('id', lf.Type.INTEGER)
            .addNullable([ 'coopName', 'closeDate', 'remainingFodder', 'lostFlocks' ])
            .addForeignKey('fk_type', {
                local: 'type',
                ref: 'FlockType.id',
                action: lf.ConstraintAction.CASCADE
            })
            .addPrimaryKey(['id'], true);
    }

    isActive(): boolean {
        return !this.closeDate; // TODO for future reference || this.closeDate.getTime() <= 0 || this.closeDate.getTime() >= Date.now();
    }

}
