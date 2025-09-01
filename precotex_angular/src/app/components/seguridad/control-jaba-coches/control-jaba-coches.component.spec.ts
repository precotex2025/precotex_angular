import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlJabaCochesComponent } from './control-jaba-coches.component';

describe('ControlJabaCochesComponent', () => {
  let component: ControlJabaCochesComponent;
  let fixture: ComponentFixture<ControlJabaCochesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ControlJabaCochesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlJabaCochesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
