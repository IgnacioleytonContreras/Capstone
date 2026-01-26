import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarMascota } from './buscar-mascota';

describe('BuscarMascota', () => {
  let component: BuscarMascota;
  let fixture: ComponentFixture<BuscarMascota>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscarMascota]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscarMascota);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
