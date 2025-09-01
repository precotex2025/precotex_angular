import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantMaestroBolsaItemComponent } from './mant-maestro-bolsa-item.component';

describe('MantMaestroBolsaItemComponent', () => {
  let component: MantMaestroBolsaItemComponent;
  let fixture: ComponentFixture<MantMaestroBolsaItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MantMaestroBolsaItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MantMaestroBolsaItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
