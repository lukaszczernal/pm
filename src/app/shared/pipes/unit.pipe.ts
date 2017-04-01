import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'unit' })
export class Unit implements PipeTransform {

    constructor() {
        console.count('Unit pipe');
    }

    transform(value: any, unit: string): number | '' {
        let float = parseFloat(value);
        let res = isNaN(float) ? value : `${value} ${unit}`;

        return res;
    }


}