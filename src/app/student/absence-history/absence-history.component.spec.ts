import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbsenceHistoryComponent } from './absence-history.component';

describe('AbsenceHistoryComponent', () => {
  let component: AbsenceHistoryComponent;
  let fixture: ComponentFixture<AbsenceHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AbsenceHistoryComponent]
    });
    fixture = TestBed.createComponent(AbsenceHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
