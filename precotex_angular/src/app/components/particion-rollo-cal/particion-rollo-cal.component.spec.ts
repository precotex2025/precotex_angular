import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticionRolloCalComponent } from './particion-rollo-cal.component';

describe('ParticionRolloCalComponent', () => {
  let component: ParticionRolloCalComponent;
  let fixture: ComponentFixture<ParticionRolloCalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticionRolloCalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticionRolloCalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
