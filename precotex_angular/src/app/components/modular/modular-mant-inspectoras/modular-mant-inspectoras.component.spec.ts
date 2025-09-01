import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModularMantInspectorasComponent } from './modular-mant-inspectoras.component';

describe('ModularMantInspectorasComponent', () => {
  let component: ModularMantInspectorasComponent;
  let fixture: ComponentFixture<ModularMantInspectorasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModularMantInspectorasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModularMantInspectorasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
