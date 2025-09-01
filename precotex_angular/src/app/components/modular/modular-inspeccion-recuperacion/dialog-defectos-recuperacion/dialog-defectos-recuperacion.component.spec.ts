import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDefectosRecuperacionComponent } from './dialog-defectos-recuperacion.component';

describe('DialogDefectosRecuperacionComponent', () => {
  let component: DialogDefectosRecuperacionComponent;
  let fixture: ComponentFixture<DialogDefectosRecuperacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDefectosRecuperacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDefectosRecuperacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
