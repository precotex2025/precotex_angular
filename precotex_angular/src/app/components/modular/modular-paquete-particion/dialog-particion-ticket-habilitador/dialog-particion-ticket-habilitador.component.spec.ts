import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogParticionTicketHabilitadorComponent } from './dialog-particion-ticket-habilitador.component';

describe('DialogParticionTicketHabilitadorComponent', () => {
  let component: DialogParticionTicketHabilitadorComponent;
  let fixture: ComponentFixture<DialogParticionTicketHabilitadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogParticionTicketHabilitadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogParticionTicketHabilitadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
