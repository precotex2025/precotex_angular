import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesarConfirmacionModalComponent } from './procesar-confirmacion-modal.component';

describe('ProcesarConfirmacionModalComponent', () => {
  let component: ProcesarConfirmacionModalComponent;
  let fixture: ComponentFixture<ProcesarConfirmacionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcesarConfirmacionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesarConfirmacionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
