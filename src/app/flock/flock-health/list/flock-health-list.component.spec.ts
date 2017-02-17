/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FlockHealthListComponent } from './flock-health-list.component';

describe('FlockHealthListComponent', () => {
  let component: FlockHealthListComponent;
  let fixture: ComponentFixture<FlockHealthListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlockHealthListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlockHealthListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
