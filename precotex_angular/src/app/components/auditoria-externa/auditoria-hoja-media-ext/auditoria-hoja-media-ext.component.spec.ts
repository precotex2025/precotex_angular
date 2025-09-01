import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriaHojaMediaExtComponent } from './auditoria-hoja-media-ext.component';

describe('AuditoriaHojaMediaExtComponent', () => {
  let component: AuditoriaHojaMediaExtComponent;
  let fixture: ComponentFixture<AuditoriaHojaMediaExtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditoriaHojaMediaExtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditoriaHojaMediaExtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
