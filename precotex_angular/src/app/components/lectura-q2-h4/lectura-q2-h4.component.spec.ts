import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturaQ2H4Component } from './lectura-q2-h4.component';

describe('LecturaQ2H4Component', () => {
  let component: LecturaQ2H4Component;
  let fixture: ComponentFixture<LecturaQ2H4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LecturaQ2H4Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LecturaQ2H4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
