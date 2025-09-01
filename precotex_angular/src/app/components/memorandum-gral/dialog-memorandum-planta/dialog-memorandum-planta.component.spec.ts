import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMemorandumPlantaComponent } from './dialog-memorandum-planta.component';

describe('DialogMemorandumPlantaComponent', () => {
  let component: DialogMemorandumPlantaComponent;
  let fixture: ComponentFixture<DialogMemorandumPlantaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMemorandumPlantaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMemorandumPlantaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
