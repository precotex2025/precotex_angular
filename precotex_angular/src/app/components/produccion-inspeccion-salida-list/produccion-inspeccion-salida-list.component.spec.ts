import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduccionInspeccionSalidaListComponent } from './produccion-inspeccion-salida-list.component';

describe('ProduccionInspeccionSalidaListComponent', () => {
  let component: ProduccionInspeccionSalidaListComponent;
  let fixture: ComponentFixture<ProduccionInspeccionSalidaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProduccionInspeccionSalidaListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProduccionInspeccionSalidaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
