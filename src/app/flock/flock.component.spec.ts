/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FlockComponent } from './flock.component';

describe('FlockComponent', () => {
  let component: FlockComponent;
  let fixture: ComponentFixture<FlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
