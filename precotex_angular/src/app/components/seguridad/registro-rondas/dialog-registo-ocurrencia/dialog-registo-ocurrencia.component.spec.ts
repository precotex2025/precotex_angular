import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRegistoOcurrenciaComponent } from './dialog-registo-ocurrencia.component';

describe('DialogRegistoOcurrenciaComponent', () => {
  let component: DialogRegistoOcurrenciaComponent;
  let fixture: ComponentFixture<DialogRegistoOcurrenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRegistoOcurrenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRegistoOcurrenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
