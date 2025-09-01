import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturaRollosEmbalajeComponent } from './lectura-rollos-embalaje.component';

describe('LecturaRollosEmbalajeComponent', () => {
  let component: LecturaRollosEmbalajeComponent;
  let fixture: ComponentFixture<LecturaRollosEmbalajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LecturaRollosEmbalajeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LecturaRollosEmbalajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
