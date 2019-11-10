import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvinsiComponent } from './provinsi.component';

describe('ProvinsiComponent', () => {
  let component: ProvinsiComponent;
  let fixture: ComponentFixture<ProvinsiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvinsiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvinsiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
