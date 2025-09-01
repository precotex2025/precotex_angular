import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditoriaHojaMoldeFinalComponent } from './auditoria-hoja-molde-final.component';

describe('AuditoriaHojaMoldeFinalComponent', () => {
  let component: AuditoriaHojaMoldeFinalComponent;
  let fixture: ComponentFixture<AuditoriaHojaMoldeFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditoriaHojaMoldeFinalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditoriaHojaMoldeFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
