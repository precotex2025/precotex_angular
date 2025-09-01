import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActasAcuerdoComponent } from './actas-acuerdo.component';

describe('ActasAcuerdoComponent', () => {
  let component: ActasAcuerdoComponent;
  let fixture: ComponentFixture<ActasAcuerdoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActasAcuerdoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActasAcuerdoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
