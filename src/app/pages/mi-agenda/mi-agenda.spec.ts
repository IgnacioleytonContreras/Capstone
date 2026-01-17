import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiAgenda } from './mi-agenda';

describe('MiAgenda', () => {
  let component: MiAgenda;
  let fixture: ComponentFixture<MiAgenda>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiAgenda]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiAgenda);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
