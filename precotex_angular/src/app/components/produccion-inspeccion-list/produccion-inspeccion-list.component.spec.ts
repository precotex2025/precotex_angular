import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduccionInspeccionListComponent } from './produccion-inspeccion-list.component';

describe('ProduccionInspeccionListComponent', () => {
  let component: ProduccionInspeccionListComponent;
  let fixture: ComponentFixture<ProduccionInspeccionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProduccionInspeccionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProduccionInspeccionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
