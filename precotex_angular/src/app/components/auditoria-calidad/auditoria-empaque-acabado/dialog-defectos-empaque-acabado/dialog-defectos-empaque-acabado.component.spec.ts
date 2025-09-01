import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDefectosEmpaqueAcabadoComponent } from './dialog-defectos-empaque-acabado.component';

describe('DialogDefectosEmpaqueAcabadoComponent', () => {
  let component: DialogDefectosEmpaqueAcabadoComponent;
  let fixture: ComponentFixture<DialogDefectosEmpaqueAcabadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDefectosEmpaqueAcabadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDefectosEmpaqueAcabadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
