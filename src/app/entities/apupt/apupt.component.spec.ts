import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApuptComponent } from './apupt.component';

describe('ApuptComponent', () => {
  let component: ApuptComponent;
  let fixture: ComponentFixture<ApuptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApuptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApuptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
