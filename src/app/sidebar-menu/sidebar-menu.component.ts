import { Component, OnInit } from '@angular/core';
import { FlocksService } from 'app/shared/service/flocks.service';
import { Observable } from 'rxjs/Observable';
import { Flock } from 'app/models/flock.model';

@Component({
    selector: 'app-sidebar-menu',
    templateUrl: './sidebar-menu.component.html',
    styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit {

    private activeFlocks: Observable<Flock[]>;
    private closedFlocks: Observable<Flock[]>;

    constructor(
        private flocksService: FlocksService
    ) { }

    ngOnInit() {
        this.activeFlocks = this.flocksService.activeFlocks;
        this.closedFlocks = this.flocksService.closedFlocks;
    }

}
