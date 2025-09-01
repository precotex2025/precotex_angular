import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalidaTiendaComponent } from './salida-tienda.component';

describe('SalidaTiendaComponent', () => {
  let component: SalidaTiendaComponent;
  let fixture: ComponentFixture<SalidaTiendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalidaTiendaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalidaTiendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
