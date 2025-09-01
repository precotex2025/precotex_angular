import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModularReimpresionTicketComponent } from './modular-reimpresion-ticket.component';

describe('ModularReimpresionTicketComponent', () => {
  let component: ModularReimpresionTicketComponent;
  let fixture: ComponentFixture<ModularReimpresionTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModularReimpresionTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModularReimpresionTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
