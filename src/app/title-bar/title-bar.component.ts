import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-title-bar',
    styleUrls: ['./title-bar.component.scss'],
    templateUrl: './title-bar.component.html'
})
export class TitleBarComponent {

    @Input() heading: string;
    @Input() day: number;
    @Input() totalDays: number;

    constructor() {
        this.day = 0;
        this.totalDays = 0;
    }

}
