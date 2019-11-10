import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerorisComponent } from './teroris.component';

describe('TerorisComponent', () => {
  let component: TerorisComponent;
  let fixture: ComponentFixture<TerorisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerorisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerorisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
