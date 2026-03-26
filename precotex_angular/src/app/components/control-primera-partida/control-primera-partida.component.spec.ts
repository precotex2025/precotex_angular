import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlPrimeraPartidaComponent } from './control-primera-partida.component';

describe('ControlPrimeraPartidaComponent', () => {
  let component: ControlPrimeraPartidaComponent;
  let fixture: ComponentFixture<ControlPrimeraPartidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlPrimeraPartidaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlPrimeraPartidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
