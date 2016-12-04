import * as lf from 'lovefield';

export class Flock {

    public static TABLE_NAME = 'flock';

    public static parseRows(rows: Object[]): Flock[] {
        let flocks: Flock[] = [];
        for (let row of rows) {
            flocks.push(new Flock(
                row['type'],
                row['coopSize'],
                row['coopName'],
                row['name'],
                row['createDate'],
                row['closeDate'],
                row['id']
            ));
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

    constructor(public type: string,
                public coopSize: number,
                public coopName: string,
                public name: string,
                public createDate: Date = new Date(),
                public closeDate: Date = new Date(0),
                public id?: number) {}

    toRow(): Object {
        return Object.assign({}, this);
    }
}
