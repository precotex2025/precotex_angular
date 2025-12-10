import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobacionDesarrolloTelasEditComponent } from './aprobacion-desarrollo-telas-edit.component';

describe('AprobacionDesarrolloTelasEditComponent', () => {
  let component: AprobacionDesarrolloTelasEditComponent;
  let fixture: ComponentFixture<AprobacionDesarrolloTelasEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AprobacionDesarrolloTelasEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobacionDesarrolloTelasEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
