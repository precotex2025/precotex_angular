import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturaRolloExportacionComponent } from './lectura-rollo-exportacion.component';

describe('LecturaRolloExportacionComponent', () => {
  let component: LecturaRolloExportacionComponent;
  let fixture: ComponentFixture<LecturaRolloExportacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LecturaRolloExportacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LecturaRolloExportacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
