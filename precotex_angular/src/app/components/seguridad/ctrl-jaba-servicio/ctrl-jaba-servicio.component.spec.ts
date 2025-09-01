import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CtrlJabaServicioComponent } from './ctrl-jaba-servicio.component';

describe('CtrlJabaServicioComponent', () => {
  let component: CtrlJabaServicioComponent;
  let fixture: ComponentFixture<CtrlJabaServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CtrlJabaServicioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CtrlJabaServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
