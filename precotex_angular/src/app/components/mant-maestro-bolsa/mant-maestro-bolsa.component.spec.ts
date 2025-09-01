import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantMaestroBolsaComponent } from './mant-maestro-bolsa.component';

describe('MantMaestroBolsaComponent', () => {
  let component: MantMaestroBolsaComponent;
  let fixture: ComponentFixture<MantMaestroBolsaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MantMaestroBolsaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MantMaestroBolsaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
