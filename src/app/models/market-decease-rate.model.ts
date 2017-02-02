import * as lf from 'lovefield';
import { BaseModel } from '../shared/base.model';

export class MarketDeceaseRate extends BaseModel {

    static TABLE_NAME = 'MarketDeceaseRate';

    day: number;
    rate: number;
    type: number;
    id: number;

    public static parseRows(rows: Object[]): MarketDeceaseRate[] { // TOOD move to base model
        return rows.map(row => new MarketDeceaseRate(row));
    }

    public static createTable(schemaBuilder) {
        schemaBuilder.createTable(MarketDeceaseRate.TABLE_NAME)
            .addColumn('day', lf.Type.INTEGER)
            .addColumn('rate', lf.Type.INTEGER)
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
