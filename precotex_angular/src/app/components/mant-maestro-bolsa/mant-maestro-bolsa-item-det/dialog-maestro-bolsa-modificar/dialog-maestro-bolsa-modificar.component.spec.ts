import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMaestroBolsaModificarComponent } from './dialog-maestro-bolsa-modificar.component';

describe('DialogMaestroBolsaModificarComponent', () => {
  let component: DialogMaestroBolsaModificarComponent;
  let fixture: ComponentFixture<DialogMaestroBolsaModificarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMaestroBolsaModificarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMaestroBolsaModificarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
