import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaPreviaCheckComponent } from './vista-previa-check.component';

describe('VistaPreviaCheckComponent', () => {
  let component: VistaPreviaCheckComponent;
  let fixture: ComponentFixture<VistaPreviaCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaPreviaCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaPreviaCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
