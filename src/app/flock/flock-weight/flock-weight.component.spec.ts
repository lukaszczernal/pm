/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FlockWeightComponent } from './flock-weight.component';

describe('FlockWeightComponent', () => {
  let component: FlockWeightComponent;
  let fixture: ComponentFixture<FlockWeightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlockWeightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlockWeightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
