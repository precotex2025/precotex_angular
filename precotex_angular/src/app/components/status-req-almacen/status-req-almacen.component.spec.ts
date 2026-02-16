import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusReqAlmacenComponent } from './status-req-almacen.component';

describe('StatusReqAlmacenComponent', () => {
  let component: StatusReqAlmacenComponent;
  let fixture: ComponentFixture<StatusReqAlmacenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusReqAlmacenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusReqAlmacenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
