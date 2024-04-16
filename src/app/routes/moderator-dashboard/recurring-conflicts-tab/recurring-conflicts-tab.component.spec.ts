import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringConflictsTabComponent } from './recurring-conflicts-tab.component';

describe('RecurringConflictsTabComponent', () => {
  let component: RecurringConflictsTabComponent;
  let fixture: ComponentFixture<RecurringConflictsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecurringConflictsTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecurringConflictsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
