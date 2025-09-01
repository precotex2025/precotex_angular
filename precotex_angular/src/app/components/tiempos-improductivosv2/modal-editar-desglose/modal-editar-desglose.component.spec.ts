import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarDesgloseComponent } from './modal-editar-desglose.component';

describe('ModalEditarDesgloseComponent', () => {
  let component: ModalEditarDesgloseComponent;
  let fixture: ComponentFixture<ModalEditarDesgloseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalEditarDesgloseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEditarDesgloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
