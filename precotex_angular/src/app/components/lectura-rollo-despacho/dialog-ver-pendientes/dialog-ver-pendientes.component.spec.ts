import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogVerPendientesComponent } from './dialog-ver-pendientes.component';

describe('DialogVerPendientesComponent', () => {
  let component: DialogVerPendientesComponent;
  let fixture: ComponentFixture<DialogVerPendientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogVerPendientesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogVerPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
