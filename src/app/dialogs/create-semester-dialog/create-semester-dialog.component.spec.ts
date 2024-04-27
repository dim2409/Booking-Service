import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSemesterDialogComponent } from './create-semester-dialog.component';

describe('CreateSemesterDialogComponent', () => {
  let component: CreateSemesterDialogComponent;
  let fixture: ComponentFixture<CreateSemesterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSemesterDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateSemesterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
