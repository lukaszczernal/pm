import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'unit' })
export class Unit implements PipeTransform {

    constructor() {
        console.count('Unit pipe');
    }

    transform(value: any, unit: string): number | '' {
        const float = parseFloat(value);
        const res = isNaN(float) ? value : `${value} ${unit}`;

        return res;
    }


}