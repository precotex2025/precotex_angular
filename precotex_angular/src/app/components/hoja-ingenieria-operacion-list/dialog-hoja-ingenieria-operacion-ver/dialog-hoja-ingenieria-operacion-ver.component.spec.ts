import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogHojaIngenieriaOperacionVerComponent } from './dialog-hoja-ingenieria-operacion-ver.component';

describe('', () => {
  let component: DialogHojaIngenieriaOperacionVerComponent;
  let fixture: ComponentFixture<DialogHojaIngenieriaOperacionVerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogHojaIngenieriaOperacionVerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogHojaIngenieriaOperacionVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
