import * as lf from 'lovefield';
import { BaseModel } from '../shared/base.model';

export class FlockFodder extends BaseModel {

    static TABLE_NAME = 'FlockFodder';

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
            .addNullable([ 'type', 'provider' ])
            .addForeignKey('fk_flock', {
                local: 'flock',
                ref: 'Flock.id',
                action: lf.ConstraintAction.CASCADE
            })
            .addPrimaryKey(['id'], true);
    }

}
