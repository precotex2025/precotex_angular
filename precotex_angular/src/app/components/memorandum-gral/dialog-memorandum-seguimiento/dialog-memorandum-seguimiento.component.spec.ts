import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMemorandumSeguimientoComponent } from './dialog-memorandum-seguimiento.component';

describe('DialogMemorandumSeguimientoComponent', () => {
  let component: DialogMemorandumSeguimientoComponent;
  let fixture: ComponentFixture<DialogMemorandumSeguimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMemorandumSeguimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMemorandumSeguimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
