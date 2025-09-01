import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMaestroBolsaIteDetModificarComponent } from './dialog-maestro-bolsa-ite-det-modificar.component';

describe('DialogMaestroBolsaIteDetModificarComponent', () => {
  let component: DialogMaestroBolsaIteDetModificarComponent;
  let fixture: ComponentFixture<DialogMaestroBolsaIteDetModificarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMaestroBolsaIteDetModificarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMaestroBolsaIteDetModificarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
