import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Urgencias } from './urgencias';

describe('Urgencias', () => {
  let component: Urgencias;
  let fixture: ComponentFixture<Urgencias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Urgencias]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Urgencias);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
