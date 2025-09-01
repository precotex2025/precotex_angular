import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRegistarEmpaqueAcabadoComponent } from './dialog-registar-empaque-acabado.component';

describe('DialogRegistarEmpaqueAcabadoComponent', () => {
  let component: DialogRegistarEmpaqueAcabadoComponent;
  let fixture: ComponentFixture<DialogRegistarEmpaqueAcabadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRegistarEmpaqueAcabadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRegistarEmpaqueAcabadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
