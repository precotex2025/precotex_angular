import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriaFinalExternaComponent } from './auditoria-final-externa.component';

describe('AuditoriaFinalExternaComponent', () => {
  let component: AuditoriaFinalExternaComponent;
  let fixture: ComponentFixture<AuditoriaFinalExternaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditoriaFinalExternaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditoriaFinalExternaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
