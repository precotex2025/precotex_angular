import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInformeCierreComponent } from './modal-informe-cierre.component';

describe('ModalInformeCierreComponent', () => {
  let component: ModalInformeCierreComponent;
  let fixture: ComponentFixture<ModalInformeCierreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalInformeCierreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalInformeCierreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
