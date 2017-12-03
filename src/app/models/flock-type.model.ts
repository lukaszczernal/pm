import * as lf from 'lovefield';

export class FlockType {

    static TABLE_NAME = 'FlockType';

    breedingPeriod: number;
    name: string;
    id: number;

    public static parseRows(rows: Object[]): FlockType[] {
        const flockTypes: FlockType[] = [];
        for (const row of rows) {
            flockTypes.push(new FlockType(row));
        }
        return flockTypes;
    }

    public static createTable(schemaBuilder) {
        schemaBuilder.createTable(FlockType.TABLE_NAME)
            .addColumn('breedingPeriod', lf.Type.INTEGER)
            .addColumn('name', lf.Type.STRING)
            .addColumn('id', lf.Type.INTEGER)
            .addPrimaryKey(['id'], true);
    }

    constructor(data: {}) { // TODO move to base
        Object.assign(this, data);
    }

    toRow(): Object {
        return Object.assign({}, this);
    }

}
