import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Dati2Component } from './dati2.component';

describe('Dati2Component', () => {
  let component: Dati2Component;
  let fixture: ComponentFixture<Dati2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Dati2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Dati2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
