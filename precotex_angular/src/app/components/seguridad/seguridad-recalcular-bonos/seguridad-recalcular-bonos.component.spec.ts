import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguridadRecalcularBonosComponent } from './seguridad-recalcular-bonos.component';

describe('SeguridadRecalcularBonosComponent', () => {
  let component: SeguridadRecalcularBonosComponent;
  let fixture: ComponentFixture<SeguridadRecalcularBonosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeguridadRecalcularBonosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguridadRecalcularBonosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
