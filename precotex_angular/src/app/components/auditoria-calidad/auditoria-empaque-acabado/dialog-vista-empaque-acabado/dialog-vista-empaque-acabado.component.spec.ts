import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogVistaEmpaqueAcabadoComponent } from './dialog-vista-empaque-acabado.component';

describe('DialogVistaEmpaqueAcabadoComponent', () => {
  let component: DialogVistaEmpaqueAcabadoComponent;
  let fixture: ComponentFixture<DialogVistaEmpaqueAcabadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogVistaEmpaqueAcabadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogVistaEmpaqueAcabadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
