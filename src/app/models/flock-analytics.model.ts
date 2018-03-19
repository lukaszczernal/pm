import * as lf from 'lovefield';
import { BaseModel } from '../shared/base.model';

export class FlockAnalytics extends BaseModel {

    static TABLE_NAME = 'FlockAnalytics';

    eww: number;
    fcr: number;
    deceaseRate: number;
    weight: number;
    price: number;
    income: number;
    earnings: number;
    flock: number;

    public static parseRows(rows: FlockAnalytics[]): FlockAnalytics[] { // TODO move to base model
        return rows.map(row => new FlockAnalytics(row));
    }
    public static createTable(schemaBuilder) {
        schemaBuilder.createTable(FlockAnalytics.TABLE_NAME)
            .addColumn('id', lf.Type.INTEGER)
            .addColumn('flock', lf.Type.INTEGER)
            .addColumn('eww', lf.Type.INTEGER)
            .addColumn('fcr', lf.Type.INTEGER)
            .addColumn('deceaseRate', lf.Type.INTEGER)
            .addColumn('weight', lf.Type.INTEGER)
            .addColumn('price', lf.Type.INTEGER)
            .addColumn('income', lf.Type.INTEGER)
            .addColumn('earnings', lf.Type.INTEGER)
            .addForeignKey('fk_flock', {
                local: 'flock',
                ref: 'Flock.id',
                action: lf.ConstraintAction.CASCADE
            })
            .addPrimaryKey(['id'], true);
    }

}
