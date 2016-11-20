/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { InsertComponent } from './insert.component';

describe('InsertComponent', () => {
  let component: InsertComponent;
  let fixture: ComponentFixture<InsertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
