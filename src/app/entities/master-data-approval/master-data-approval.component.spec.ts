import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterDataApprovalComponent } from './master-data-approval.component';

describe('MasterDataApprovalComponent', () => {
  let component: MasterDataApprovalComponent;
  let fixture: ComponentFixture<MasterDataApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterDataApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterDataApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
