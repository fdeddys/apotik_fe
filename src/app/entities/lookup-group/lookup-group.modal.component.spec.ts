import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LookupGroupModalComponent } from './lookup-group.modal.component';

describe('LookupGroupModalComponent', () => {
  let component: LookupGroupModalComponent;
  let fixture: ComponentFixture<LookupGroupModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LookupGroupModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LookupGroupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
