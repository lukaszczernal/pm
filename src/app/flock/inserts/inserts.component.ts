import { Component, OnInit } from '@angular/core';

@Component({
    template: `
        <app-flock-inserts-list
            [model]="model"
            (save)="save($event)"
            (cancel)="cancel()"></app-flock-inserts-list>
    `,
    styleUrls: ['./inserts.component.scss']
})
export class InsertsComponent implements OnInit {

    constructor() { }

    ngOnInit() { }

}
