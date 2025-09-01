import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CnfRegistroPresentacionComponent } from './cnf-registro-presentacion.component';

describe('CnfRegistroPresentacionComponent', () => {
  let component: CnfRegistroPresentacionComponent;
  let fixture: ComponentFixture<CnfRegistroPresentacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CnfRegistroPresentacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CnfRegistroPresentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
