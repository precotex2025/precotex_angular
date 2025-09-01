import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRegistarDefectoEmpaqueAcabadoComponent } from './dialog-registar-defecto-empaque-acabado.component';

describe('DialogRegistarDefectoEmpaqueAcabadoComponent', () => {
  let component: DialogRegistarDefectoEmpaqueAcabadoComponent;
  let fixture: ComponentFixture<DialogRegistarDefectoEmpaqueAcabadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRegistarDefectoEmpaqueAcabadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRegistarDefectoEmpaqueAcabadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
