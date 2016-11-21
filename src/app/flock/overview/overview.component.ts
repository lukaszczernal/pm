import { Component, OnInit } from '@angular/core';
import { FLOCK_MENU_ITEMS } from './_data/flock-menu-items';
import { FlockMenuItem } from './flock-menu-item';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
    sections: FlockMenuItem[];

    constructor() {
        this.sections = FLOCK_MENU_ITEMS;
    }

    ngOnInit() {}

}
