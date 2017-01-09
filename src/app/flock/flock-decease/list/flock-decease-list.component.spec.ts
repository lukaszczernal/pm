/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FlockDeceaseListComponent } from './flock-decease-list.component';

describe('FlockDeceaseListComponent', () => {
  let component: FlockDeceaseListComponent;
  let fixture: ComponentFixture<FlockDeceaseListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlockDeceaseListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlockDeceaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
