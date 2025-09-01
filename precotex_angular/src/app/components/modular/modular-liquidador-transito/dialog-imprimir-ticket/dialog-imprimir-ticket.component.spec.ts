import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogImprimirTicketComponent } from './dialog-imprimir-ticket.component';

describe('DialogImprimirTicketComponent', () => {
  let component: DialogImprimirTicketComponent;
  let fixture: ComponentFixture<DialogImprimirTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogImprimirTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogImprimirTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
