import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantMaestroBolsaItemDetComponent } from './mant-maestro-bolsa-item-det.component';

describe('MantMaestroBolsaItemDetComponent', () => {
  let component: MantMaestroBolsaItemDetComponent;
  let fixture: ComponentFixture<MantMaestroBolsaItemDetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MantMaestroBolsaItemDetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MantMaestroBolsaItemDetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
