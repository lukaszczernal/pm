import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class Farm {

    getFlockList(): Observable<any> {
        console.count('getFlockList');
        return Observable.create((subscriber) => {
            return subscriber.next([
                { id: 4, title: 'Stado 4' },
                { id: 5, title: 'Stado 5' },
                { id: 6, title: 'Stado 6' }
            ]);
        });
    }

}
