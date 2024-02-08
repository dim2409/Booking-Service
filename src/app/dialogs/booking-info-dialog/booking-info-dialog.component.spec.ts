import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingInfoDialogComponent } from './booking-info-dialog.component';

describe('BookingInfoDialogComponent', () => {
  let component: BookingInfoDialogComponent;
  let fixture: ComponentFixture<BookingInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingInfoDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookingInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
