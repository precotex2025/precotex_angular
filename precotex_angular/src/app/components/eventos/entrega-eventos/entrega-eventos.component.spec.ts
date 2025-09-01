import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregaEventosComponent } from './entrega-eventos.component';

describe('EntregaEventosComponent', () => {
  let component: EntregaEventosComponent;
  let fixture: ComponentFixture<EntregaEventosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntregaEventosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntregaEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
