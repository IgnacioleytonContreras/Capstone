import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MascotaNueva } from './mascota-nueva';

describe('MascotaNueva', () => {
  let component: MascotaNueva;
  let fixture: ComponentFixture<MascotaNueva>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MascotaNueva]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MascotaNueva);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
