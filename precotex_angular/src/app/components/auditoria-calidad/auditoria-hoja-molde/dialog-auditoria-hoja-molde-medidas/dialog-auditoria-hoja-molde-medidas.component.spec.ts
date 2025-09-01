import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAuditoriaHojaMoldeMedidasComponent } from './dialog-auditoria-hoja-molde-medidas.component';

describe('DialogAuditoriaHojaMoldeMedidasComponent', () => {
  let component: DialogAuditoriaHojaMoldeMedidasComponent;
  let fixture: ComponentFixture<DialogAuditoriaHojaMoldeMedidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAuditoriaHojaMoldeMedidasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAuditoriaHojaMoldeMedidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
