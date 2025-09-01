import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuiaContingenciaComponent } from './guia-contingencia.component';

describe('GuiaContingenciaComponent', () => {
  let component: GuiaContingenciaComponent;
  let fixture: ComponentFixture<GuiaContingenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuiaContingenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuiaContingenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
