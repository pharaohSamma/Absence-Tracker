import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentLayoutComponent } from './parent-layout.component';

describe('ParentLayoutComponent', () => {
  let component: ParentLayoutComponent;
  let fixture: ComponentFixture<ParentLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParentLayoutComponent]
    });
    fixture = TestBed.createComponent(ParentLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
