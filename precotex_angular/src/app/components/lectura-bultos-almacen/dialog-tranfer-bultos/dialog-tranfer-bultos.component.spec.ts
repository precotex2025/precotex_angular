import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTranferBultosComponent } from './dialog-tranfer-bultos.component';

describe('DialogTranferBultosComponent', () => {
  let component: DialogTranferBultosComponent;
  let fixture: ComponentFixture<DialogTranferBultosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogTranferBultosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTranferBultosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
