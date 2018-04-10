import { Component, OnInit, Inject } from '@angular/core';
import { APP_INFO } from '../app.info';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

    constructor(@Inject(APP_INFO) public info) { }

}
