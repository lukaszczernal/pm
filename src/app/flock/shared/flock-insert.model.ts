import * as lf from 'lovefield';

export class FlockInsert { // TODO extend Base Model

    static TABLE_NAME = 'FlockInsert';

    date: Date = new Date();
    quantity: number;
    flock: number;
    price: number;
    weight: number;
    id: number;
    provider: string;

    public static parseRows(rows: Object[]): FlockInsert[] { // TOOD move to base model
        const flocks: FlockInsert[] = [];
        for (const row of rows) {  // TODO refactor return row.map(new FlockInsert)
            flocks.push(new FlockInsert(row));
        }
        return flocks;
    }

    public static createTable(schemaBuilder) {
        schemaBuilder.createTable(FlockInsert.TABLE_NAME)
            .addColumn('date', lf.Type.DATE_TIME)
            .addColumn('quantity', lf.Type.INTEGER)
            .addColumn('flock', lf.Type.INTEGER)
            .addColumn('price', lf.Type.NUMBER)
            .addColumn('id', lf.Type.INTEGER)
            .addColumn('provider', lf.Type.STRING)
            .addNullable([ 'provider' ])
            .addForeignKey('fk_flock', {
                local: 'flock',
                ref: 'Flock.id',
                action: lf.ConstraintAction.CASCADE
            })
            .addPrimaryKey(['id'], true);
    }


    constructor(data) { // TODO move to base
        this.update(data);
    }

    update(data): FlockInsert {
        return Object.assign(this, data);
    }

    toRow(): Object {
        return Object.assign({}, this);
    }

}
