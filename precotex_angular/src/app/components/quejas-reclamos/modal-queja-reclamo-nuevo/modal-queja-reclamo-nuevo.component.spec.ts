import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalQuejaReclamoNuevoComponent } from './modal-queja-reclamo-nuevo.component';

describe('ModalQuejaReclamoNuevoComponent', () => {
  let component: ModalQuejaReclamoNuevoComponent;
  let fixture: ComponentFixture<ModalQuejaReclamoNuevoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalQuejaReclamoNuevoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalQuejaReclamoNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
