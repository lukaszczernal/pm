import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class Farm {

    getFlockList(): Observable<any> {
        console.count('getFlockList');
        return Observable.create((subscriber) => {
            return subscriber.next([
                { id: 1, title: 'Stado 1' },
                { id: 2, title: 'Stado 2' },
                { id: 3, title: 'Stado 3' }
            ]);
        });
    }

}
