import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMemorandumLineaTiempoComponent } from './dialog-memorandum-linea-tiempo.component';

describe('DialogMemorandumLineaTiempoComponent', () => {
  let component: DialogMemorandumLineaTiempoComponent;
  let fixture: ComponentFixture<DialogMemorandumLineaTiempoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMemorandumLineaTiempoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMemorandumLineaTiempoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
