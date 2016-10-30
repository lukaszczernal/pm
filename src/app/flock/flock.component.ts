import { Component } from '@angular/core';
import { SECTIONS } from './data/sections';
import { Section } from './section';

@Component({
  selector: 'app-flock',
  templateUrl: './flock.component.html',
  styleUrls: ['./flock.component.scss']
})
export class FlockComponent {
    public sections: Section[] = SECTIONS;
};
