import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriaHojaMoldeComponent } from './auditoria-hoja-molde.component';

describe('AuditoriaHojaMoldeComponent', () => {
  let component: AuditoriaHojaMoldeComponent;
  let fixture: ComponentFixture<AuditoriaHojaMoldeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditoriaHojaMoldeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditoriaHojaMoldeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
