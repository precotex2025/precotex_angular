import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCheckInspeccionAudiComponent } from './dialog-check-inspeccion-audi.component';

describe('DialogCheckInspeccionAudiComponent', () => {
  let component: DialogCheckInspeccionAudiComponent;
  let fixture: ComponentFixture<DialogCheckInspeccionAudiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCheckInspeccionAudiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCheckInspeccionAudiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
