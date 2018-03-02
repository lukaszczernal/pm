import * as lf from 'lovefield';
import { BaseModel } from '../shared/base.model';

export class FlockDeceaseItem extends BaseModel {

    static TABLE_NAME = 'FlockDecease';

    deceaseDate: Date; // TODO change name to date
    quantity: number;
    flock: number;
    id?: number;

    public static parseRows(rows: FlockDeceaseItem[]): FlockDeceaseItem[] { // TOOD move to base model
        return rows.map(row => new FlockDeceaseItem(row));
    }

    public static createTable(schemaBuilder) {
        schemaBuilder.createTable(FlockDeceaseItem.TABLE_NAME)
            .addColumn('deceaseDate', lf.Type.DATE_TIME)
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

    constructor(data: FlockDeceaseItem) {
        super(data);
    }

}
