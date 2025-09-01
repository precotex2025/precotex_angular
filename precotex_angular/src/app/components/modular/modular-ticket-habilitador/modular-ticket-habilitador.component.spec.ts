import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModularTicketHabilitadorComponent } from './modular-ticket-habilitador.component';

describe('ModularTicketHabilitadorComponent', () => {
  let component: ModularTicketHabilitadorComponent;
  let fixture: ComponentFixture<ModularTicketHabilitadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModularTicketHabilitadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModularTicketHabilitadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
