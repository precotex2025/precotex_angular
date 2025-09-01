import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingJabaGuiaComponent } from './packing-jaba-guia.component';

describe('PackingJabaGuiaComponent', () => {
  let component: PackingJabaGuiaComponent;
  let fixture: ComponentFixture<PackingJabaGuiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackingJabaGuiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackingJabaGuiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
