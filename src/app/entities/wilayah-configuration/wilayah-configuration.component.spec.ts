import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WilayahConfigurationComponent } from './wilayah-configuration.component';

describe('WilayahConfigurationComponent', () => {
  let component: WilayahConfigurationComponent;
  let fixture: ComponentFixture<WilayahConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WilayahConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WilayahConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
