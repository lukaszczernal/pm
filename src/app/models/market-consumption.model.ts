import * as lf from 'lovefield';
import { BaseModel } from '../shared/base.model';

export class MarketConsumption extends BaseModel {

    static TABLE_NAME = 'MarketConsumption';

    day: number;
    fcr: number;
    type: number;
    id: number;

    public static parseRows(rows: Object[]): MarketConsumption[] { // TOOD move to base model
        return rows.map(row => new MarketConsumption(row));
    }

    public static createTable(schemaBuilder) {
        schemaBuilder.createTable(MarketConsumption.TABLE_NAME)
            .addColumn('day', lf.Type.INTEGER)
            .addColumn('fcr', lf.Type.NUMBER)
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
