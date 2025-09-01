import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAgregarpasadaComponent } from './dialog-agregarpasada.component';

describe('DialogAgregarpasadaComponent', () => {
  let component: DialogAgregarpasadaComponent;
  let fixture: ComponentFixture<DialogAgregarpasadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAgregarpasadaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAgregarpasadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
