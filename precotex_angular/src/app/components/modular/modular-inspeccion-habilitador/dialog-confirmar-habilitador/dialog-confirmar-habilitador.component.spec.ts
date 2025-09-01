import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmarHabilitadorComponent } from './dialog-confirmar-habilitador.component';

describe('DialogConfirmarHabilitadorComponent', () => {
  let component: DialogConfirmarHabilitadorComponent;
  let fixture: ComponentFixture<DialogConfirmarHabilitadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogConfirmarHabilitadorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogConfirmarHabilitadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
