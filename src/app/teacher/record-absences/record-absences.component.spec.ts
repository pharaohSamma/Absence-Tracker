import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordAbsencesComponent } from './record-absences.component';

describe('RecordAbsencesComponent', () => {
  let component: RecordAbsencesComponent;
  let fixture: ComponentFixture<RecordAbsencesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecordAbsencesComponent]
    });
    fixture = TestBed.createComponent(RecordAbsencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
