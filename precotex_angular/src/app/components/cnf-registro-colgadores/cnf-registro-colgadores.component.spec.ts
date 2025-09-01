import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnfRegistroColgadoresComponent } from './cnf-registro-colgadores.component';

describe('CnfRegistroColgadoresComponent', () => {
  let component: CnfRegistroColgadoresComponent;
  let fixture: ComponentFixture<CnfRegistroColgadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnfRegistroColgadoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnfRegistroColgadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
