import * as lf from 'lovefield';

export class Flock {

    static TABLE_NAME = 'flock';

    type: string;
    coopSize: number;
    coopName: string;
    name: string;
    createDate: Date = new Date();
    closeDate: Date = new Date(0);
    id: number;

    public static parseRows(rows: Object[]): Flock[] {
        let flocks: Flock[] = [];
        for (let row of rows) {
            flocks.push(new Flock(row));
        }
        return flocks;
    }

    public static createTable(schemaBuilder) {
        schemaBuilder.createTable(Flock.TABLE_NAME)
            .addColumn('closeDate', lf.Type.DATE_TIME)
            .addColumn('createDate', lf.Type.DATE_TIME)
            .addColumn('type', lf.Type.STRING)
            .addColumn('coopSize', lf.Type.STRING)
            .addColumn('coopName', lf.Type.STRING)
            .addColumn('name', lf.Type.STRING)
            .addColumn('id', lf.Type.INTEGER)
            .addNullable([
                'coopName'
            ])
            .addPrimaryKey(['id'], true);
    }

    constructor(data: {}) {
        Object.assign(this, data);
    }

    isActive(): boolean {
        return this.closeDate <= this.createDate;
    }

    update(data: any) {
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                this[key] = data[key];
            }
        }
        return this;
    }

    toRow(): Object {
        return Object.assign({}, this);
    }
}
