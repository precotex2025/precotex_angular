import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRecuperacionRecojoComponent } from './modal-recuperacion-recojo.component';

describe('ModalRecuperacionRecojoComponent', () => {
  let component: ModalRecuperacionRecojoComponent;
  let fixture: ComponentFixture<ModalRecuperacionRecojoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalRecuperacionRecojoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRecuperacionRecojoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
