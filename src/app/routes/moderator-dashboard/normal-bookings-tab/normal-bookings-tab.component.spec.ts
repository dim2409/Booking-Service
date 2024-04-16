import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalBookingsTabComponent } from './normal-bookings-tab.component';

describe('NormalBookingsTabComponent', () => {
  let component: NormalBookingsTabComponent;
  let fixture: ComponentFixture<NormalBookingsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NormalBookingsTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NormalBookingsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
