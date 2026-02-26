import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaTelefonicaComponent } from './agenda-telefonica.component';

describe('AgendaTelefonicaComponent', () => {
  let component: AgendaTelefonicaComponent;
  let fixture: ComponentFixture<AgendaTelefonicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgendaTelefonicaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaTelefonicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
