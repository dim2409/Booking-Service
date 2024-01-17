import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoComponent } from './mwl-demo-component';

describe('MwlDemoComponentComponent', () => {
  let component: DemoComponent;
  let fixture: ComponentFixture<DemoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemoComponent]
    });
    fixture = TestBed.createComponent(DemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
