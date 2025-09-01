import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModularTicketRecuperacionComponent } from './modular-ticket-recuperacion.component';

describe('ModularTicketRecuperacionComponent', () => {
  let component: ModularTicketRecuperacionComponent;
  let fixture: ComponentFixture<ModularTicketRecuperacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModularTicketRecuperacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModularTicketRecuperacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
