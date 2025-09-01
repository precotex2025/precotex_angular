import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogModificaTiemposImproductivosComponent } from './dialog-modifica-tiempos-improductivos.component';

describe('DialogModificaTiemposImproductivosComponent', () => {
  let component: DialogModificaTiemposImproductivosComponent;
  let fixture: ComponentFixture<DialogModificaTiemposImproductivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogModificaTiemposImproductivosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogModificaTiemposImproductivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
