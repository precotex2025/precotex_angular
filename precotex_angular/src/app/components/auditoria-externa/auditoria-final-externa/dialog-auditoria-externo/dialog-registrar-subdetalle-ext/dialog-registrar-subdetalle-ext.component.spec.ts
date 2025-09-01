import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRegistrarSubdetalleExtComponent } from './dialog-registrar-subdetalle-ext.component';

describe('DialogRegistrarSubdetalleExtComponent', () => {
  let component: DialogRegistrarSubdetalleExtComponent;
  let fixture: ComponentFixture<DialogRegistrarSubdetalleExtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRegistrarSubdetalleExtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRegistrarSubdetalleExtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
