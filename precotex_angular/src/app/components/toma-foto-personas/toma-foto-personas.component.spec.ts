import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TomaFotoPersonasComponent } from './toma-foto-personas.component';

describe('TomaFotoPersonasComponent', () => {
  let component: TomaFotoPersonasComponent;
  let fixture: ComponentFixture<TomaFotoPersonasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TomaFotoPersonasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TomaFotoPersonasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
