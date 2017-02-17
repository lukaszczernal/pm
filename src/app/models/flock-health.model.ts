import * as lf from 'lovefield';
import { BaseModel } from '../shared/base.model';

export class FlockHealth extends BaseModel {

    static TABLE_NAME = 'FlockHealth';

    date: Date;
    type: number;
    description: string;
    cost: number;
    flock: number;
    id: number;

    public static parseRows(rows: Object[]): FlockHealth[] { // TOOD move to base model
        return rows.map(row => new FlockHealth(row));
    }

    public static createTable(schemaBuilder) {
        schemaBuilder.createTable(FlockHealth.TABLE_NAME)
            .addColumn('date', lf.Type.DATE_TIME)
            .addColumn('type', lf.Type.INTEGER)
            .addColumn('description', lf.Type.STRING)
            .addColumn('cost', lf.Type.NUMBER)
            .addColumn('flock', lf.Type.INTEGER)
            .addColumn('id', lf.Type.INTEGER)
            .addForeignKey('fk_flock', {
                local: 'flock',
                ref: 'Flock.id',
                action: lf.ConstraintAction.CASCADE
            })
            .addPrimaryKey(['id'], true);
    }

}
