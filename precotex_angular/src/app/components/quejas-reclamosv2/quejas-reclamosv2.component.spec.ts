import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuejasReclamosv2Component } from './quejas-reclamosv2.component';

describe('QuejasReclamosv2Component', () => {
  let component: QuejasReclamosv2Component;
  let fixture: ComponentFixture<QuejasReclamosv2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuejasReclamosv2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuejasReclamosv2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
