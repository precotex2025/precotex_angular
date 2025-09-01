import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HipocampoComponent } from './hipocampo.component';

describe('HipocampoComponent', () => {
  let component: HipocampoComponent;
  let fixture: ComponentFixture<HipocampoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HipocampoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HipocampoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
