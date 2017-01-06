import * as lf from 'lovefield';

export class FlockInsert {

    static TABLE_NAME = 'FlockInsert';

    createDate: Date = new Date();
    quantity: number;
    price: number;
    id: number;

    public static parseRows(rows: Object[]): FlockInsert[] { // TOOD move to base model
        let flocks: FlockInsert[] = [];
        for (let row of rows) {
            flocks.push(new FlockInsert(row));
        }
        return flocks;
    }

    public static createTable(schemaBuilder) {
        schemaBuilder.createTable(FlockInsert.TABLE_NAME)
            .addColumn('createDate', lf.Type.DATE_TIME)
            .addColumn('quantity', lf.Type.INTEGER)
            .addColumn('price', lf.Type.NUMBER)
            .addColumn('id', lf.Type.INTEGER)
            .addPrimaryKey(['id'], true);
    }


    constructor(data: {}) { // TODO move to base
        this.update(data);
    }

    update(data): FlockInsert {
        Object.assign(this, data);
        return this;
    }

    toRow(): Object {
        return Object.assign({}, this);
    }

}
