import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalNameRiskComponent } from './internal-name-risk.component';

describe('InternalNameRiskComponent', () => {
  let component: InternalNameRiskComponent;
  let fixture: ComponentFixture<InternalNameRiskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalNameRiskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalNameRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
