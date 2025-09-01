import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroCalidadTejeduriaComponent } from './registro-calidad-tejeduria.component';




describe('RegistroCalidadTejeduriaComponent', () => {
  let component: RegistroCalidadTejeduriaComponent;
  let fixture: ComponentFixture<RegistroCalidadTejeduriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroCalidadTejeduriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroCalidadTejeduriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
