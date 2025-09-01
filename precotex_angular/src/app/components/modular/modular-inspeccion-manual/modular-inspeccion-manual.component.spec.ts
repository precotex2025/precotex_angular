import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModularInspeccionManualComponent } from './modular-inspeccion-manual.component';

describe('ModularInspeccionManualComponent', () => {
  let component: ModularInspeccionManualComponent;
  let fixture: ComponentFixture<ModularInspeccionManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModularInspeccionManualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModularInspeccionManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
