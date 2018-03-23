import * as lf from 'lovefield';
import { BaseModel } from '../shared/base.model';

export class FlockCostType extends BaseModel {

    static TABLE_NAME = 'FlockCostType';

    name: string;
    id: number;

    public static parseRows(rows: Object[]): FlockCostType[] {
        return rows.map(row => new FlockCostType(row));
    }

    public static createTable(schemaBuilder) {
        schemaBuilder.createTable(FlockCostType.TABLE_NAME)
            .addColumn('name', lf.Type.STRING)
            .addColumn('id', lf.Type.INTEGER)
            .addPrimaryKey(['id'], true);
    }

}
