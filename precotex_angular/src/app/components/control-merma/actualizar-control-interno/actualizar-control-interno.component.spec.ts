import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarControlInternoComponent } from './actualizar-control-interno.component';

describe('ActualizarControlInternoComponent', () => {
  let component: ActualizarControlInternoComponent;
  let fixture: ComponentFixture<ActualizarControlInternoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActualizarControlInternoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualizarControlInternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
