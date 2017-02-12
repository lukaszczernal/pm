import * as lf from 'lovefield';
import { BaseModel } from '../shared/base.model';

export class MarketWeight extends BaseModel {

    static TABLE_NAME = 'MarketWeight';

    day: number;
    value: number;
    type: number;
    id: number;

    public static parseRows(rows: Object[]): MarketWeight[] { // TOOD move to base model
        return rows.map(row => new MarketWeight(row));
    }

    public static createTable(schemaBuilder) {
        schemaBuilder.createTable(MarketWeight.TABLE_NAME)
            .addColumn('day', lf.Type.INTEGER)
            .addColumn('value', lf.Type.INTEGER)
            .addColumn('type', lf.Type.INTEGER)
            .addColumn('id', lf.Type.INTEGER)
            .addForeignKey('fk_type', {
                local: 'type',
                ref: 'FlockType.id',
                action: lf.ConstraintAction.CASCADE
            })
            .addPrimaryKey(['id'], true);
    }

}
