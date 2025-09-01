import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMemorandumGralAddDetalleComponent } from './dialog-memorandum-gral-add-detalle.component';

describe('DialogMemorandumGralAddDetalleComponent', () => {
  let component: DialogMemorandumGralAddDetalleComponent;
  let fixture: ComponentFixture<DialogMemorandumGralAddDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMemorandumGralAddDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMemorandumGralAddDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
