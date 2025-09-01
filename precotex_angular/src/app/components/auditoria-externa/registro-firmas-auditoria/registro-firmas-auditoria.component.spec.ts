import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroFirmasAuditoriaComponent } from './registro-firmas-auditoria.component';

describe('RegistroFirmasAuditoriaComponent', () => {
  let component: RegistroFirmasAuditoriaComponent;
  let fixture: ComponentFixture<RegistroFirmasAuditoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroFirmasAuditoriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroFirmasAuditoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
