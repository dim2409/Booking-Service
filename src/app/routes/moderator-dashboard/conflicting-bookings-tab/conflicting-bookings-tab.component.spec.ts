import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConflictingBookingsTabComponent } from './conflicting-bookings-tab.component';

describe('ConflictingBookingsTabComponent', () => {
  let component: ConflictingBookingsTabComponent;
  let fixture: ComponentFixture<ConflictingBookingsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConflictingBookingsTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConflictingBookingsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
