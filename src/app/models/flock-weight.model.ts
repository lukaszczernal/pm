import * as lf from 'lovefield';
import { BaseModel } from '../shared/base.model';

export class FlockWeight extends BaseModel {

    static TABLE_NAME = 'FlockWeight';

    date: Date;
    value: number;
    flock: number;
    id: number;

    public static parseRows(rows: Object[]): FlockWeight[] { // TOOD move to base model
        return rows.map(row => new FlockWeight(row));
    }

    public static createTable(schemaBuilder) {
        schemaBuilder.createTable(FlockWeight.TABLE_NAME)
            .addColumn('date', lf.Type.DATE_TIME)
            .addColumn('value', lf.Type.INTEGER)
            .addColumn('flock', lf.Type.INTEGER)
            .addColumn('id', lf.Type.INTEGER)
            .addForeignKey('fk_flock', {
                local: 'flock',
                ref: 'Flock.id',
                action: lf.ConstraintAction.CASCADE
            })
            .addNullable([ 'value' ])
            .addPrimaryKey(['id'], true);
    }

}
