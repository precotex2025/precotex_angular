import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobacionDesarrolloTelasComponent } from './aprobacion-desarrollo-telas.component';

describe('AprobacionDesarrolloTelasComponent', () => {
  let component: AprobacionDesarrolloTelasComponent;
  let fixture: ComponentFixture<AprobacionDesarrolloTelasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AprobacionDesarrolloTelasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobacionDesarrolloTelasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
