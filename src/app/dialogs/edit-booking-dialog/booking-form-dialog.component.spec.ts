import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingFormDialogComponent } from './booking-form-dialog.component';

describe('BookingFormDialogComponent', () => {
  let component: BookingFormDialogComponent;
  let fixture: ComponentFixture<BookingFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingFormDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookingFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
