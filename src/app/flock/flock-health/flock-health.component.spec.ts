/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FlockHealthComponent } from './flock-health.component';

describe('FlockHealthComponent', () => {
  let component: FlockHealthComponent;
  let fixture: ComponentFixture<FlockHealthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlockHealthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlockHealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
