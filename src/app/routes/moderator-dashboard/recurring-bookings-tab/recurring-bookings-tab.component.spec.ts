import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringBookingsTabComponent } from './recurring-bookings-tab.component';

describe('RecurringBookingsTabComponent', () => {
  let component: RecurringBookingsTabComponent;
  let fixture: ComponentFixture<RecurringBookingsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecurringBookingsTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecurringBookingsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
