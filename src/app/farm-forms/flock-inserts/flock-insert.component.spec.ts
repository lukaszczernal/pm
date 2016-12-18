/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FlockInsertsComponent } from './flock-inserts.component';

describe('FlockInsertsComponent', () => {
  let component: FlockInsertsComponent;
  let fixture: ComponentFixture<FlockInsertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlockInsertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlockInsertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
