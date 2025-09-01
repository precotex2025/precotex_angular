import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduccionArtesListComponent } from './produccion-artes-list.component';

describe('ProduccionArtesListComponent', () => {
  let component: ProduccionArtesListComponent;
  let fixture: ComponentFixture<ProduccionArtesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProduccionArtesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProduccionArtesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
