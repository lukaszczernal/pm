import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'zeroDash' })
export class ZeroDash implements PipeTransform {

    constructor() {
        console.count('ZeroDash');
    }

    transform(value: number): number | string {
        let res = value === 0 ? '-' : value;
        return res;
    }


}