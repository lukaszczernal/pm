/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FlockDeceaseComponent } from './flock-decease.component';

describe('FlockDeceaseComponent', () => {
  let component: FlockDeceaseComponent;
  let fixture: ComponentFixture<FlockDeceaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlockDeceaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlockDeceaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
