import { Component } from '@angular/core';
import { FlockMenuItem } from './flock-menu-item';
import { FLOCK_MENU_ITEMS } from './_data/flock-menu-items';

@Component({
    selector: 'app-flock',
    templateUrl: './flock.component.html'
})
export class FlockComponent {
    sections: FlockMenuItem[] = FLOCK_MENU_ITEMS;
};
