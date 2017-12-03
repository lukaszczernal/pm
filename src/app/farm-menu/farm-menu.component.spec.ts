import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmMenuComponent } from './farm-menu.component';

describe('FarmMenuComponent', () => {
  let component: FarmMenuComponent;
  let fixture: ComponentFixture<FarmMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
