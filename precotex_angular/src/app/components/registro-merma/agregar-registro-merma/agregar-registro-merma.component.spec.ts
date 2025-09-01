import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarRegistroMermaComponent } from './agregar-registro-merma.component';

describe('AgregarRegistroMermaComponent', () => {
  let component: AgregarRegistroMermaComponent;
  let fixture: ComponentFixture<AgregarRegistroMermaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarRegistroMermaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarRegistroMermaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
