import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogProduccionInspeccionCrearComponent } from './dialog-produccion-inspeccion-crear.component';

describe('DialogProduccionInspeccionCrearComponent', () => {
  let component: DialogProduccionInspeccionCrearComponent;
  let fixture: ComponentFixture<DialogProduccionInspeccionCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogProduccionInspeccionCrearComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogProduccionInspeccionCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
