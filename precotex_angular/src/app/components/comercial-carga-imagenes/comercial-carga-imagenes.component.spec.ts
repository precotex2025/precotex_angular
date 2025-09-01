import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComercialCargaImagenesComponent } from './comercial-carga-imagenes.component';

describe('ComercialCargaImagenesComponent', () => {
  let component: ComercialCargaImagenesComponent;
  let fixture: ComponentFixture<ComercialCargaImagenesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComercialCargaImagenesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComercialCargaImagenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
