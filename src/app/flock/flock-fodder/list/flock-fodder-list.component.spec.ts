/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FlockFodderListComponent } from './flock-fodder-list.component';

describe('FlockFodderListComponent', () => {
  let component: FlockFodderListComponent;
  let fixture: ComponentFixture<FlockFodderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlockFodderListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlockFodderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
