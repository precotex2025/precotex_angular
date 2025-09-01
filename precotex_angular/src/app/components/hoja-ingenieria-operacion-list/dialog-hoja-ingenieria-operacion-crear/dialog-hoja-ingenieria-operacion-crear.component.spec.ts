import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogHojaIngenieriaOperacionCrearComponent } from './dialog-hoja-ingenieria-operacion-crear.component';

describe('', () => {
  let component: DialogHojaIngenieriaOperacionCrearComponent;
  let fixture: ComponentFixture<DialogHojaIngenieriaOperacionCrearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogHojaIngenieriaOperacionCrearComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogHojaIngenieriaOperacionCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
