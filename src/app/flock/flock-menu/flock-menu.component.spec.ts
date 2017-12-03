import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlockMenuComponent } from './flock-menu.component';

describe('FlockMenuComponent', () => {
  let component: FlockMenuComponent;
  let fixture: ComponentFixture<FlockMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlockMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlockMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
